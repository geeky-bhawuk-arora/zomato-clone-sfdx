import { LightningElement, api, track } from 'lwc';
import placeOrderApex from '@salesforce/apex/OrderController.placeOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderCart extends LightningElement {
    @api cartItems = [];
    @api restaurantId;
    @track customerName = '';

    get totalPrice() {
        return this.cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    }

    handleNameChange(event) {
        this.customerName = event.target.value;
    }

    placeOrder() {
        if (!this.customerName || this.cartItems.length === 0) {
            this.showToast('Error', 'Please enter your name and add items to cart.', 'error');
            return;
        }

        const payload = {
            restaurantId: this.restaurantId,
            customerName: this.customerName,
            itemsJson: JSON.stringify(this.cartItems)
        };

        placeOrderApex(payload)
            .then(result => {
                this.showToast('Success', 'Order Placed! Order ID: ' + result, 'success');
                this.customerName = '';
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}