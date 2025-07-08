import { LightningElement, track } from 'lwc';

export default class RestaurantContainer extends LightningElement {
    @track selectedCuisine = '';
    @track selectedRating = 0;
    @track selectedRestaurantId = '';
    @track searchKeyword = '';
    // @track cartItems = [];

    handleFilterChange(event) {
        this.selectedCuisine = event.detail.cuisine;
        this.selectedRating = event.detail.rating;
    }

    handleViewDetails(event) {
        this.selectedRestaurantId = event.detail;
    }

    handleBack() {
        this.selectedRestaurantId = null;
    }

    // Handle cart update from <c-restaurant-details>
    // handleCartUpdate(event) {
    //     const updatedCartItems = event.detail;
    //     console.log('Cart updated:', updatedCartItems);
    //     this.cartItems = Array.isArray(updatedCartItems) ? updatedCartItems : [];
    // }
}
