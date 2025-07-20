import { LightningElement, wire, track } from 'lwc';
import { subscribe, publish, MessageContext } from 'lightning/messageService';
import CartMessageChannel from '@salesforce/messageChannel/CartMessageChannel__c';
import fetchCurrentUserData from '@salesforce/apex/OrderController.fetchCurrentUserData';

export default class GlobalCart extends LightningElement {
    @track cart = {};
    showCheckoutModal = false;
    userEmail = '';
    userAddress = '';

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.loadCartFromStorage();
        this.subscribeToCart();
        this.fetchUserData();
    }

    fetchUserData() {
        fetchCurrentUserData()
            .then(data => {
                this.userEmail = data.email;
                this.userAddress = data.address;
            })
            .catch(() => {
                this.userEmail = '';
                this.userAddress = '';
            });
    }

    loadCartFromStorage() {
        const stored = localStorage.getItem('zomatoCart');
        if (stored) {
            this.cart = JSON.parse(stored);
            // Publish initial cart state so navbar updates badge count on page load
            publish(this.messageContext, CartMessageChannel, {
                cartSnapshot: this.cart
            });
        }
    }

    subscribeToCart() {
        subscribe(this.messageContext, CartMessageChannel, (message) => {
            this.handleCartUpdate(message);
        });
    }

    handleCartUpdate(message) {
        // When receiving a cart message from others (like adding items), update local cart
        if (!message) return;
        const { restaurantId, restaurantName, item } = message;

        if (!restaurantId || !item) return; // defensive check

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
        localStorage.setItem('zomatoCart', JSON.stringify(this.cart));

        // Publish updated cart for other listeners (like navbar)
        publish(this.messageContext, CartMessageChannel, {
            cartSnapshot: this.cart
        });
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
        // Your order placing logic here, then clear cart
        this.cart = {};
        localStorage.removeItem('zomatoCart');
        this.showCheckoutModal = false;
        // Publish cleared cart state
        publish(this.messageContext, CartMessageChannel, {
            cartSnapshot: this.cart
        });
        this.showToast('Order placed successfully!', 'success');
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
        this.showCheckoutModal = true;
    }

    handleGoToCart() {
        this.showCheckoutModal = false;
    }

    updateItemQuantity(itemId, delta) {
        for (const restaurantId in this.cart) {
            const idx = this.cart[restaurantId].findIndex(i => i.Id === itemId);
            if (idx > -1) {
                const item = this.cart[restaurantId][idx];
                item.Quantity += delta;
                if (item.Quantity <= 0) {
                    this.cart[restaurantId].splice(idx, 1);
                    if(this.cart[restaurantId].length === 0) {
                        delete this.cart[restaurantId];
                    }
                } else {
                    item.LineTotal = item.Price__c * item.Quantity;
                }
                break;
            }
        }
        this.cart = { ...this.cart };
        localStorage.setItem('zomatoCart', JSON.stringify(this.cart));

        // Publish updated cart
        publish(this.messageContext, CartMessageChannel, {
            cartSnapshot: this.cart
        });
    }

    removeItem(itemId) {
        for (const restaurantId in this.cart) {
            this.cart[restaurantId] = this.cart[restaurantId].filter(i => i.Id !== itemId);
            if(this.cart[restaurantId].length === 0) {
                delete this.cart[restaurantId];
            }
        }
        this.cart = { ...this.cart };
        localStorage.setItem('zomatoCart', JSON.stringify(this.cart));

        // Publish updated cart
        publish(this.messageContext, CartMessageChannel, {
            cartSnapshot: this.cart
        });
    }

    handleOrderPlaced() {
        this.cart = {};
        localStorage.removeItem('zomatoCart');
        this.showCheckoutModal = false;

        // Publish cleared cart
        publish(this.messageContext, CartMessageChannel, {
            cartSnapshot: this.cart
        });
    }

    showToast(message, variant = 'info') {
        const evt = new ShowToastEvent({
            message,
            variant,
        });
        this.dispatchEvent(evt);
    }

    get totalAmount() {
        return this.allCartItems.reduce((sum, item) => sum + (item.LineTotal || 0), 0);
    }
}
