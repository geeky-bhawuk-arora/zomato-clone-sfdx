import { LightningElement, track } from 'lwc';

export default class RestaurantContainer extends LightningElement {
    @track selectedCuisine = '';
    @track selectedRating = 0;
    @track selectedRestaurantId = '';
    @track searchKeyword = '';
    @track cartItems = [];

    // Receive filter change event from restaurantFilter
    handleFilterChange(event) {
        this.selectedCuisine = event.detail.cuisine;
        this.selectedRating = event.detail.rating;
        this.searchKeyword = event.detail.keyword;
    }

    // Receive selected restaurant ID from restaurantList
    handleRestaurantSelect(event) {
        this.selectedRestaurantId = event.detail.restaurantId;
        this.cartItems = []; // reset cart if new restaurant selected
    }

    // Receive updated cart items from restaurantDetails
    handleCartUpdate(event) {
        this.cartItems = event.detail;
    }
}
