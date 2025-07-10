import { LightningElement, api } from 'lwc';

export default class OrderCheckout extends LightningElement {
    @api items = [];
    customerName = '';
    address = '';
    phone = '';

    handleNameChange(e) { this.customerName = e.target.value; }
    handleAddressChange(e) { this.address = e.target.value; }
    handlePhoneChange(e) { this.phone = e.target.value; }

    handlePlaceOrder() {
        this.dispatchEvent(new CustomEvent('placeorder', {
            detail: {
                customerName: this.customerName,
                address: this.address,
                phone: this.phone,
                items: this.items
            }
        }));
    }
}