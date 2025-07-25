import { LightningElement, track } from 'lwc';
import createOrder from '@salesforce/apex/OrderController.createOrder';

export default class RestaurantContainer extends LightningElement {
    @track selectedCuisine = null;
    @track selectedRating = null;
    @track selectedRestaurantId = null;

    handleFilterChange(event) {
        this.selectedCuisine = event.detail.cuisine;
        this.selectedRating = event.detail.rating;
        // console.log('Filter Changed');
        // console.log('Selected Cuisine:', this.selectedCuisine);
        // console.log('Selected Rating:', this.selectedRating);
    }

    handleViewDetails(event) {
        this.selectedRestaurantId = event.detail.restaurantId;
        // console.log('View Details Clicked. Restaurant ID:', this.selectedRestaurantId);
    }

    handleBack() {
        console.log('Back to list clicked');
        this.selectedRestaurantId = null;
    }


    @track selectedRestaurantId = null;
    @track cartItems = [];
    @track isCartVisible = false;

    // handleCartUpdate(event) {
    //     this.cartItems = event.detail;
    //     console.log('Cart updated:', JSON.stringify(this.cartItems));
    // }

    // handleGoToCart() {
    //     this.isCartVisible = true;
    // }

    // handlePlaceOrder() {
    //     // Save order via Apex (in next step)
    //     console.log('Placing order...');
    //     this.isCartVisible = false;
    //     this.selectedRestaurantId = null;
    //     this.cartItems = [];
    // }

    handleCartUpdate(event) {
        this.cartItems = event.detail;
    }

    isCheckout = false;

    handleCheckout() {
        this.isCheckout = true;
    }

    async handlePlaceOrder(event) {
        const { customerName, address, phone, items } = event.detail;
        try {
            await createOrder({ customerName, address, phone, items });
            localStorage.removeItem('zomatoCart');
            this.cartItems = [];
            this.isCheckout = false;
            // this.showToast('Order placed successfully!', 'success');
        } catch (error) {
            // this.showToast('Order failed: ' + error.body.message, 'error');
            console.error('Order save failed', error);
        }
    }

    handleOrderPlaced() {
        this.cartItems = [];
        this.isCheckout = false;
        // Optionally show a toast here if not handled in child
    }
}

