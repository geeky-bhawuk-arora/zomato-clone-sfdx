import { LightningElement, api, wire, track } from 'lwc';
import getRestaurantDetails from '@salesforce/apex/RestaurantController.getRestaurantDetails';
import getMenuItems from '@salesforce/apex/RestaurantController.getMenuItems';

export default class RestaurantDetails extends LightningElement {
    @api restaurantId;
    restaurant;
    menuItems;

    @wire(getRestaurantDetails, { restaurantId: '$restaurantId' })
    wiredRestaurant({ error, data }) {
        if (data) {
            this.restaurant = data;
        }
    }

    @wire(getMenuItems, { restaurantId: '$restaurantId' })
    wiredMenu({ error, data }) {
        if (data) {
            this.menuItems = data;
        }
    }



    // Add to Cart Fucntionality
    @track itemQuantities = {}; 
    @track cartItems = [];

    increaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const currentQty = this.itemQuantities[itemId] || 0;
        this.itemQuantities = { ...this.itemQuantities, [itemId]: currentQty + 1 };
    }

    decreaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const currentQty = this.itemQuantities[itemId] || 0;
        if (currentQty > 0) {
            this.itemQuantities = { ...this.itemQuantities, [itemId]: currentQty - 1 };
        }
    }

    handleAddToCart(event) {
        const itemId = event.target.dataset.id;
        const qty = this.itemQuantities[itemId] || 0;
        if (qty === 0) return;

        const item = this.menuItems.data.find(i => i.Id === itemId);
        if (!item) return;

        // Copy cart or create new if empty
        const newCart = [...this.cartItems];

        const index = newCart.findIndex(ci => ci.Id === itemId);
        if (index > -1) {
            // Update existing item quantity
            newCart[index] = { ...newCart[index], Quantity: newCart[index].Quantity + qty };
        } else {
            // Add new item to cart
            newCart.push({
                Id: item.Id,
                Name: item.Name,
                Price__c: item.Price__c,
                Quantity: qty
            });
        }

        this.cartItems = newCart;

        // Reset quantity input
        this.itemQuantities = { ...this.itemQuantities, [itemId]: 0 };

        // Notify parent
        this.dispatchEvent(new CustomEvent('cartupdate', { detail: this.cartItems }));
    }

    // Go to Cart --> Parent to fetch the selected items
    getSelectedItems() {
        return this.cartItems;
    }
}