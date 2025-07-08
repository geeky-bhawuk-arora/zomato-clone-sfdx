import { LightningElement, api, wire } from 'lwc';
import getRestaurantDetails from '@salesforce/apex/RestaurantController.getRestaurantDetails';
import getMenuItems from '@salesforce/apex/RestaurantController.getMenuItems';

export default class RestaurantDetails extends LightningElement {
    @api restaurantId;
    restaurant;
    menuItems;
    itemQuantities = {};

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

    handleQuantityChange(event) {
        const itemId = event.target.dataset.id;
        const qty = parseInt(event.target.value, 10) || 0;
        this.itemQuantities = { ...this.itemQuantities, [itemId]: qty };
        console.log('Updated Quantity:', this.itemQuantities);
    }

    handleReviewOrder() {
        const selectedItems = [];
        const items = this.menuItems.data;

        for (let item of items) {
            const quantity = this.itemQuantities[item.Id] || 0;
            if (quantity > 0) {
                selectedItems.push({
                    Id: item.Id,
                    Name: item.Name,
                    Price__c: item.Price__c,
                    Quantity: quantity
                });
            }
        }

        console.log('Selected Items:', JSON.stringify(selectedItems));
        
        this.dispatchEvent(new CustomEvent('revieworder', {
            detail: selectedItems
        }));
    }
}