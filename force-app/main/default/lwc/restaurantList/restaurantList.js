import { LightningElement, api, wire } from 'lwc';
import getRestaurants from '@salesforce/apex/RestaurantController.getRestaurants';

export default class RestaurantList extends LightningElement {
    @api cuisine;
    @api rating; 
    @api keyword;

    @wire(getRestaurants, { cuisine: '$cuisine', minRating: '$rating', keyword: '$keyword' }) // props
    restaurants;

    handleViewDetails(event) {
        const selectedId = event.currentTarget.dataset.id;
        console.log('Button clicked: ' + selectedId); // check console
        this.dispatchEvent(new CustomEvent('viewdetails', { detail: selectedId }));
    }

}
