public class ReviewPageController {
    public String token { get; set; }
    public Boolean invalidToken { get; set; }
    public Boolean reviewSubmittedNow { get; set; }

    public String reviewerName { get; set; }
    public String comments { get; set; }
    public Integer rating { get; set; }

    private Order__c currentOrder;

    public ReviewPageController() {
        reviewSubmittedNow = false;
        invalidToken = false;

        token = ApexPages.currentPage().getParameters().get('token');

        System.debug('ReviewPageController constructor - token: ' + token);

        if (String.isBlank(token)) {
            invalidToken = true;
            return;
        }

        List<Order__c> orders = [
            SELECT Id, Restaurant__c, Review_Submitted__c
            FROM Order__c
            WHERE Review_Link_Token__c = :token
            LIMIT 1
        ];

        if (orders.isEmpty()) {
            invalidToken = true;
            return;
        }

        currentOrder = orders[0];

        if (currentOrder.Review_Submitted__c) {
            invalidToken = true;
        }

        System.debug('Current Order found: ' + currentOrder);
    }

    public PageReference submitReview() {
        try {
            if (invalidToken || currentOrder == null) {
                ApexPages.addMessage(new ApexPages.Message(
                    ApexPages.Severity.ERROR, 'Invalid or expired link.'));
                return null;
            }

            if (rating == null || rating < 1 || rating > 5) {
                ApexPages.addMessage(new ApexPages.Message(
                    ApexPages.Severity.ERROR, 'Please enter a rating between 1 and 5.'));
                return null;
            }

            Integer existingReviews = [
                SELECT COUNT()
                FROM Review__c
                WHERE COrder__c = :currentOrder.Id
            ];

            if (existingReviews > 0) {
                invalidToken = true;
                ApexPages.addMessage(new ApexPages.Message(
                    ApexPages.Severity.INFO, 'A review has already been submitted.'));
                return null;
            }

            Review__c review = new Review__c();
            review.COrder__c = currentOrder.Id;
            review.Restaurant__c = currentOrder.Restaurant__c;
            review.Reviewer_Name__c = reviewerName;
            review.Comment__c = comments;
            review.Rating__c = rating;
            insert review;

            currentOrder.Review_Submitted__c = true;
            update currentOrder;

            reviewSubmittedNow = true;
            return null; // No redirect!

        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(
                ApexPages.Severity.ERROR, 'Error submitting review: ' + e.getMessage()));
            return null;
        }
    }
}