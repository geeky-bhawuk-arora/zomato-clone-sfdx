import { LightningElement, api } from 'lwc';

export default class CartReview extends LightningElement {
    @api selectedItems = [];

    handlePlaceOrder() {
        this.dispatchEvent(new CustomEvent('placeorder'));
    }
}