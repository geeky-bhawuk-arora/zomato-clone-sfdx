import { LightningElement, api, wire } from 'lwc';
import getReviews from '@salesforce/apex/ReviewController.getReviews';

export default class ReviewList extends LightningElement {
    @api restaurantId;
    reviews;
    error;

    @wire(getReviews, { restaurantId: '$restaurantId' })
    wiredReviews({ error, data }) {
        if (data) {
            this.reviews = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.reviews = undefined;
        }
    }
}