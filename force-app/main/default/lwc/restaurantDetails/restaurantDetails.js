import { LightningElement, api, wire, track } from 'lwc';
import getRestaurantDetails from '@salesforce/apex/RestaurantController.getRestaurantDetails';
import getMenuItems from '@salesforce/apex/RestaurantController.getMenuItems';

import { publish, MessageContext } from 'lightning/messageService';
import CartMessageChannel from '@salesforce/messageChannel/CartMessageChannel__c';

// import { addItem } from 'c/cartService'; // singleton import

export default class RestaurantDetails extends LightningElement {
    @api restaurantId;
    @track restaurant;
    @track menuItems = [];
    @track itemQuantities = {};

    @wire(getRestaurantDetails, { restaurantId: '$restaurantId' })
    wiredRestaurant({ error, data }) {
        if (data) {
            this.restaurant = data;
        } else if (error) {
            console.error('Error fetching restaurant details:', error);
        }
    }

    @wire(getMenuItems, { restaurantId: '$restaurantId' })
    wiredMenu({ error, data }) {
        if (data) {
            this.menuItems = data.map(item => ({
                ...item,
                quantity: this.itemQuantities[item.Id] || 0
            }));
        } else if (error) {
            console.error('Error fetching menu items:', error);
        }
    }

    increaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const currentQty = this.itemQuantities[itemId] || 0;
        this.itemQuantities = {
            ...this.itemQuantities,
            [itemId]: currentQty + 1
        };
        this.refreshMenuItems();
    }

    decreaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const currentQty = this.itemQuantities[itemId] || 0;
        if (currentQty > 0) {
            this.itemQuantities = {
                ...this.itemQuantities,
                [itemId]: currentQty - 1
            };
            this.refreshMenuItems();
        }
    }

    refreshMenuItems() {
        this.menuItems = this.menuItems.map(item => ({
            ...item,
            quantity: this.itemQuantities[item.Id] || 0
        }));
    }

    // @track cartItems = [];

    // handleAddToCart(event) {
    //     const itemId = event.target.dataset.id;
    //     const qty = this.itemQuantities[itemId] || 0;
    //     if (qty === 0) return;

    //     const item = this.menuItems.find(i => i.Id === itemId);
    //     if (!item) return;

    //     const newCart = [...this.cartItems];
    //     const index = newCart.findIndex(ci => ci.Id === itemId);

    //     if (index > -1) {
    //         // Update quantity
    //         newCart[index] = {
    //             ...newCart[index],
    //             Quantity: newCart[index].Quantity + qty,
    //             LineTotal: newCart[index].Price__c * (newCart[index].Quantity + qty)
    //         };

    //     } else {
    //         // Add new item
    //         newCart.push({
    //             Id: item.Id,
    //             Name: item.Name,
    //             Price__c: item.Price__c,
    //             Quantity: qty,
    //             LineTotal: item.Price__c * qty
    //         });

    //     }

    //     this.cartItems = newCart;
    //     this.itemQuantities = { ...this.itemQuantities, [itemId]: 0 };
    //     this.refreshMenuItems(); // Reset quantity to 0 in UI
    // }


    // LMS

    @wire(MessageContext) messageContext;

    handleAddToCart(event) {
        const itemId = event.target.dataset.id;
        const qty = this.itemQuantities[itemId] || 0;
        if (qty === 0) return;

        const item = this.menuItems.find(i => i.Id === itemId);
        if (!item) return;

        const payload = {
            restaurantId: this.restaurantId,
            item: {
                Id: item.Id,
                Name: item.Name,
                Price__c: item.Price__c,
                Quantity: qty,
                LineTotal: item.Price__c * qty
            }
        };

        console.log('Publishing to cart LMS:', JSON.stringify(payload));
        publish(this.messageContext, CartMessageChannel, payload);

        // Reset quantity for this item
        // this.itemQuantities = {
        //     ...this.itemQuantities,
        //     [itemId]: 0
        // };
        // this.refreshMenuItems();
    }

    // singleton module
    //    handleAddToCart(event) {
    //     const itemId = event.target.dataset.id;
    //     const qty = this.itemQuantities[itemId] || 0;
    //     if (qty === 0) return;

    //     const item = this.menuItems.find(i => i.Id === itemId);
    //     if (!item) return;

    //     addItem(this.restaurantId, {
    //         Id: item.Id,
    //         Name: item.Name,
    //         Price__c: item.Price__c,
    //         Quantity: qty,
    //         LineTotal: item.Price__c * qty
    //     });

    //     this.itemQuantities = { ...this.itemQuantities, [itemId]: 0 };
    //     this.refreshMenuItems();
    // }
}
