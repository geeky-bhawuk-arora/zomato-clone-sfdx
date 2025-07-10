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
        const { restaurantId, restaurantName, item } = message;
        if (!this.cart[restaurantId]) {
            this.cart[restaurantId] = [];
        }

        const index = this.cart[restaurantId].findIndex(i => i.Id === item.Id);
        if (index > -1) {
            const existing = this.cart[restaurantId][index];
            existing.Quantity += item.Quantity;
            existing.LineTotal += item.LineTotal;
        } else {
            this.cart[restaurantId].push({ ...item, restaurantName });
        }

        this.cart = { ...this.cart }; // force reactivity
        localStorage.setItem('zomatoCart', JSON.stringify(this.cart)); // persist cart
    }

    get allCartItems() {
        if (!this.cart) {
            return [];
        }
        return Object.entries(this.cart).flatMap(([restaurantId, items]) =>
            (items || []).map(item => ({
                ...item,
                restaurantId
            }))
        );
    }

    get safeSelectedItems() {
        const items = this.allCartItems;
        return Array.isArray(items) ? items : [];
    }

    handlePlaceOrder() {
        // Here you would call an Apex method to save the order, if needed
        // For now, just clear the cart and hide the review panel
        localStorage.removeItem('zomatoCart');
        this.cartItems = [];
        this.isCartVisible = false;
        this.selectedRestaurantId = null;
        // Optionally, show a toast or confirmation
        // this.showToast('Order placed successfully!', 'success');
    }

    handleIncrease(event) {
        const itemId = event.target.dataset.id;
        this.updateItemQuantity(itemId, 1);
    }
    handleDecrease(event) {
        const itemId = event.target.dataset.id;
        this.updateItemQuantity(itemId, -1);
    }
    handleRemove(event) {
        const itemId = event.target.dataset.id;
        this.removeItem(itemId);
    }
    handleCheckout() {
        this.dispatchEvent(new CustomEvent('checkout'));
    }
    updateItemQuantity(itemId, delta) {
        for (const restaurantId in this.cart) {
            const idx = this.cart[restaurantId].findIndex(i => i.Id === itemId);
            if (idx > -1) {
                const item = this.cart[restaurantId][idx];
                item.Quantity += delta;
                if (item.Quantity <= 0) {
                    this.cart[restaurantId].splice(idx, 1);
                } else {
                    item.LineTotal = item.Price__c * item.Quantity;
                }
                break;
            }
        }
        this.cart = { ...this.cart };
        localStorage.setItem('zomatoCart', JSON.stringify(this.cart));
    }
    removeItem(itemId) {
        for (const restaurantId in this.cart) {
            this.cart[restaurantId] = this.cart[restaurantId].filter(i => i.Id !== itemId);
        }
        this.cart = { ...this.cart };
        localStorage.setItem('zomatoCart', JSON.stringify(this.cart));
    }
}
