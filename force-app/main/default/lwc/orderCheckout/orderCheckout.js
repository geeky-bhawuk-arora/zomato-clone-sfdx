import { LightningElement, api } from 'lwc';
import createOrder from '@salesforce/apex/OrderController.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderCheckout extends LightningElement {
    @api items = [];
    @api totalAmount;
    @api userEmail;
    customerName = '';
    address = '';
    billingAddress = '';
    phone = '';

    handleNameChange(e) { this.customerName = e.target.value; }
    handleAddressChange(e) { this.address = e.target.value; }
    handleBillingAddressChange(e) { this.billingAddress = e.target.value; }
    handlePhoneChange(e) { this.phone = e.target.value; }

    async handlePlaceOrder() {
        const { customerName, address, billingAddress, phone, email, items, totalAmount } = {
            customerName: this.customerName,
            address: this.address,
            billingAddress: this.billingAddress,
            phone: this.phone,
            email: this.userEmail,
            items: this.items,
            totalAmount: this.totalAmount
        };
        try {
            await createOrder({ customerName, address, phone, items });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Order Placed',
                    message: 'Your order has been placed successfully!',
                    variant: 'success'
                })
            );
            this.dispatchEvent(new CustomEvent('placeorder'));
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Order Failed',
                    message: error.body && error.body.message ? error.body.message : 'Order could not be placed.',
                    variant: 'error'
                })
            );
        }
    }

    handleGoToCart() {
        this.dispatchEvent(new CustomEvent('gotocart'));
    }
}