import { LightningElement, track } from 'lwc';

export default class RestaurantFilter extends LightningElement {
    @track selectedCuisine = 'Indian';
    @track minRating = 3;

    cuisineOptions = [
        { label: 'Indian', value: 'Indian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Italian', value: 'Italian' }
    ];

    handleCuisineChange(event) {
        this.selectedCuisine = event.detail.value;
        this.dispatchFilterChange();
    }

    handleRatingChange(event) {
        const value = event.detail.value;
        this.minRating = value !== '' ? parseFloat(value) : null;
        this.dispatchFilterChange();
    }

    dispatchFilterChange() {
        this.dispatchEvent(new CustomEvent('filterchange', {
            detail: {
                cuisine: this.selectedCuisine,
                rating: this.minRating
            }
        }));
    }
}
