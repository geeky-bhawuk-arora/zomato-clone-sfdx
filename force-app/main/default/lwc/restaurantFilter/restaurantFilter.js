import { LightningElement } from 'lwc';

export default class RestaurantFilter extends LightningElement {
    selectedCuisine = 'Indian';
    minRating = 3;

    cuisineOptions = [
        { label: 'Indian', value: 'Indian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Italian', value: 'Italian' },
    ];

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
            }
        }));
    }
}
