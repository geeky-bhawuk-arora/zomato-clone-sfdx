import { LightningElement } from 'lwc';
import { getCart, clearCart } from 'c/cartService';

export default class GlobalCart extends LightningElement {
    cart = {};

    connectedCallback() {
        this.loadCart();
    }

    loadCart() {
        this.cart = getCart();
    }

    get allCartItems() {
        return Object.entries(this.cart).flatMap(([restaurantId, items]) =>
            items.map(item => ({
                ...item,
                restaurantId
            }))
        );
    }

    get grandTotal() {
        return this.allCartItems.reduce((sum, i) => sum + i.LineTotal, 0);
    }

    handleClearCart() {
        clearCart();
        this.loadCart();
    }
}
