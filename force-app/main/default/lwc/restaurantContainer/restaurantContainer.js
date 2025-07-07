import { LightningElement, track } from 'lwc';

export default class RestaurantContainer extends LightningElement {
    @track selectedCuisine = 'Indian';
    @track selectedRating = 3;
    @track selectedRestaurantId = null;
    @track searchKeyword = '';


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

    handleFilterChange(event) {
        this.selectedCuisine = event.detail.cuisine;
        this.selectedRating = event.detail.rating;
        this.searchKeyword = event.detail.keyword;
    }

}
