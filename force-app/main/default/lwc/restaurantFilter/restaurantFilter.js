import { LightningElement } from 'lwc';

export default class RestaurantFilter extends LightningElement {
    searchKeyword = '';
    selectedCuisine = 'Indian';
    minRating = 3;

    cuisineOptions = [
        { label: 'Indian', value: 'Indian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Italian', value: 'Italian' },
    ];

    handleKeywordChange(event) {
        this.searchKeyword = event.detail.value;
        this.dispatch();
    }

    handleCuisineChange(event) {
        this.selectedCuisine = event.detail.value;
        this.dispatch();
    }

    handleRatingChange(event) {
        this.minRating = event.detail.value;
        this.dispatch();
    }

    dispatch() {
        this.dispatchEvent(new CustomEvent('filterchange', {
            detail: {
                cuisine: this.selectedCuisine,
                rating: this.minRating,
                keyword: this.searchKeyword
            }
        }));
    }
}
