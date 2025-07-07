import { LightningElement, api, wire } from 'lwc';
import getRestaurants from '@salesforce/apex/RestaurantController.getRestaurants';

export default class RestaurantList extends LightningElement {
    @api cuisine;
    @api rating; 

    @wire(getRestaurants, { cuisine: '$cuisine', minRating: '$rating' }) // props
    restaurants;
}
