import { LightningElement, track } from 'lwc';

export default class RestaurantContainer extends LightningElement {
    @track selectedCuisine = '';
    @track selectedRating = 0;
    @track selectedRestaurantId = '';
    @track searchKeyword = '';
    // @track cartItems = [];

    handleFilterChange(event) {
        this.selectedCuisine = event.detail.cuisine || '';
        this.selectedRating = event.detail.rating || 0;
        this.searchKeyword = event.detail.keyword || '';
    }

    handleRestaurantSelect(event) {
        const restaurantId = event.detail.restaurantId;
        console.log('handleRestaurantSelect called with restaurantId:', restaurantId);

        if (restaurantId) {
            this.selectedRestaurantId = restaurantId;
            // this.cartItems = [];
        } else {
            console.warn('No restaurantId found in event.detail');
            this.selectedRestaurantId = ''; 
        }
    }

    // Handle cart update from <c-restaurant-details>
    // handleCartUpdate(event) {
    //     const updatedCartItems = event.detail;
    //     console.log('Cart updated:', updatedCartItems);
    //     this.cartItems = Array.isArray(updatedCartItems) ? updatedCartItems : [];
    // }
}
