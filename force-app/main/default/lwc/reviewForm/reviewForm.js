import { LightningElement, api, track } from 'lwc';
import saveReview from '@salesforce/apex/ReviewController.saveReview';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ReviewForm extends LightningElement {
    @api restaurantId;
    @track name = '';
    @track rating = 5;
    @track comment = '';

    handleNameChange(event) {
        this.name = event.target.value;
    }
    handleRatingChange(event) {
        this.rating = event.target.value;
    }
    handleCommentChange(event) {
        this.comment = event.target.value;
    }

    submitReview() {
        if (!this.name || !this.rating || !this.comment) {
            this.showToast('Error', 'All fields are required', 'error');
            return;
        }

        saveReview({ restaurantId: this.restaurantId, name: this.name, rating: this.rating, comment: this.comment })
            .then(() => {
                this.name = '';
                this.rating = 5;
                this.comment = '';
                this.showToast('Success', 'Review submitted!', 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}