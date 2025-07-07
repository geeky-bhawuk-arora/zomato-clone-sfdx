import { LightningElement, api, wire } from 'lwc';
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
}