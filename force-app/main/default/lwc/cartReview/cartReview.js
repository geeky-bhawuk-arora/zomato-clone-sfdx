import { LightningElement, api } from 'lwc';

export default class CartReview extends LightningElement {
    @api selectedItems;

    get totalAmount() {
        return this.selectedItems.reduce((sum, item) => {
            return sum + (item.Price__c * item.Quantity);
        }, 0);
    }

    handlePlaceOrder() {
        this.dispatchEvent(new CustomEvent('placeorder'));
    }
}
