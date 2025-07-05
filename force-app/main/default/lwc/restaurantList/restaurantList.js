import { LightningElement, wire, track } from 'lwc';
import getRestaurants from '@salesforce/apex/RestaurantController.getRestaurants';

export default class RestaurantList extends LightningElement {
    @track selectedCuisine = 'Indian';
    @track minRating = 3.0;
    @track selectedRestaurantId;
    cuisineOptions = [
        { label: 'Indian', value: 'Indian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Italian', value: 'Italian' }
    ];

    @wire(getRestaurants, { cuisine: '$selectedCuisine', minRating: '$minRating' })
    restaurants;

    handleCuisineChange(event) {
        this.selectedCuisine = event.detail.value;
    }

    handleRatingChange(event) {
        this.minRating = event.detail.value;
    }

    handleViewMenu(event) {
        this.selectedRestaurantId = event.target.dataset.id;
        const customEvent = new CustomEvent('restaurantselected', { detail: this.selectedRestaurantId });
        this.dispatchEvent(customEvent);
    }
}