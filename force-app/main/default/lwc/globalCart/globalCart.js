import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import CartMessageChannel from '@salesforce/messageChannel/CartMessageChannel__c';

export default class GlobalCart extends LightningElement {
    @track cart = {};

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.loadCartFromStorage();
        this.subscribeToCart();
    }

    loadCartFromStorage() {
        const stored = localStorage.getItem('zomatoCart');
        if (stored) {
            this.cart = JSON.parse(stored);
        }
    }

    subscribeToCart() {
        subscribe(this.messageContext, CartMessageChannel, (message) => {
            this.handleCartUpdate(message);
        });
    }

    handleCartUpdate(message) {
        const { restaurantId, item } = message;
        if (!this.cart[restaurantId]) {
            this.cart[restaurantId] = [];
        }

        const index = this.cart[restaurantId].findIndex(i => i.Id === item.Id);
        if (index > -1) {
            const existing = this.cart[restaurantId][index];
            existing.Quantity += item.Quantity;
            existing.LineTotal += item.LineTotal;
        } else {
            this.cart[restaurantId].push({ ...item });
        }

        this.cart = { ...this.cart }; // force reactivity
        localStorage.setItem('zomatoCart', JSON.stringify(this.cart)); // persist cart
    }

    get allCartItems() {
        return Object.entries(this.cart).flatMap(([restaurantId, items]) =>
            items.map(item => ({
                ...item,
                restaurantId
            }))
        );
    }
}
