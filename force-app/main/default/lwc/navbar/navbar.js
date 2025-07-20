import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import CartMessageChannel from '@salesforce/messageChannel/CartMessageChannel__c';

export default class Navbar extends LightningElement {
    @track isCartOpen = false;
    @track itemCount = 0;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.loadCartCount();
        subscribe(this.messageContext, CartMessageChannel, () => {
            this.loadCartCount();
        });
    }

    loadCartCount() {
        const stored = localStorage.getItem('zomatoCart');
        const cart = stored ? JSON.parse(stored) : {};
        let count = 0;
        for (let items of Object.values(cart)) {
            count += items.reduce((sum, item) => sum + item.Quantity, 0);
        }
        this.itemCount = count;
    }

    toggleCart() {
        this.isCartOpen = !this.isCartOpen;
    }
}
