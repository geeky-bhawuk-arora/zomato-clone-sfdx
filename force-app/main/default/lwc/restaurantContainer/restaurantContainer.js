import { LightningElement, track } from 'lwc';

export default class RestaurantContainer extends LightningElement {
    @track selectedCuisine = '';
    @track selectedRating = '';
    @track selectedRestaurantId = null;
    itemQuantities = {};

    handleFilterChange(event) {
        this.selectedCuisine = event.detail.cuisine;
        this.selectedRating = event.detail.rating;

        console.log('Filter Changed');
        console.log('Selected Cuisine:', this.selectedCuisine);
        console.log('Selected Rating:', this.selectedRating);
    }

    handleViewDetails(event) {
        this.selectedRestaurantId = event.detail.restaurantId;
        console.log('View Details Clicked. Restaurant ID:', this.selectedRestaurantId);
    }

    handleBack() {
        console.log('Back to list clicked');
        this.selectedRestaurantId = null;
    }

    handleQuantityChange(event) {
        const itemId = event.target.dataset.id;
        const quantity = parseInt(event.target.value, 10);
        this.itemQuantities = { ...this.itemQuantities, [itemId]: quantity };
    }

}
