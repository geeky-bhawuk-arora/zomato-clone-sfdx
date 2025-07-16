import { LightningElement, wire, track } from 'lwc';
import getRestaurantOrders from '@salesforce/apex/OrderController.getRestaurantOrders';
import updateOrderStatus from '@salesforce/apex/OrderController.updateOrderStatus';
// import sendOrderEmail from '@salesforce/apex/OrderController.sendOrderEmail';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
  { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', typeAttributes: { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" } },
  { label: 'Record Id', fieldName: 'Id', type: 'text' },
  { label: 'Customer Name', fieldName: 'Name', type: 'text' },
  { label: 'Contact No', fieldName: 'Contact_No_c', type: 'text' },
  { label: 'Order Details', fieldName: 'Order_Details__c', type: 'text', wrapText: true },
  { label: 'Status', fieldName: 'Status__c', type: 'text' },
  { label: 'Comments', fieldName: 'Comments__c', type: 'text' },
  { label: 'Additional Notes', fieldName: 'Additional_Details__c', type: 'text' },
  {
    type: 'action',
    typeAttributes: {
      rowActions: [
        // { label: 'Send for Delivery', name: 'send_delivery', iconName: 'utility:send', disabled: { fieldName: 'disableAction' } },
        { label: 'Send for Delivery', name: 'send_delivery', iconName: 'utility:send' },
        { label: 'Receipt', name: 'receipt', iconName: 'utility:preview' },
        { label: 'Print Receipt', name: 'print_receipt', iconName: 'utility:print' }
      ]
    }
  }
];

export default class OrderManager extends LightningElement {
  @track orders;
  @track error;
  columns = COLUMNS;
  wiredOrdersResult;

  @wire(getRestaurantOrders)
  wiredOrders(result) {
    this.wiredOrdersResult = result;
    const { error, data } = result;
    if (data) {
      this.orders = data.map(order => ({
        ...order,
        Name: order.Name,
        Contact_No_c: order.Contact_No__c,
        OrderDetails: order.Order_Items__r ? order.Order_Items__r.map(i => `${i.Name} (x${i.Quantity__c})`).join(', ') : '',
        disableAction: order.Status__c !== 'Preparing'
      }));
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.orders = undefined;
    }
  }

  handleRowAction(event) {
    const action = event.detail.action;
    const row = event.detail.row;

    if (action.name === 'send_delivery') {
      updateOrderStatus({ orderId: row.Id, newStatus: 'Out for Delivery' })
        // .then(() => {
          // Send email to customer
          // return sendOrderEmail({ orderId: row.Id });
        // })
        .then(() => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Success',
              message: 'Order sent for delivery and email sent to customer.',
              variant: 'success'
            })
          );
          return refreshApex(this.wiredOrdersResult);
        })
        .catch(error => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Error',
              message: error.body ? error.body.message : error.message,
              variant: 'error'
            })
          );
        });
    } else if (action.name === 'print_receipt') {
      window.open(`/apex/OrderReceiptVF?id=${row.Id}`, '_blank');
    }
  }
}
