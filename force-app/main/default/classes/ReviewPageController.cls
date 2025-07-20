public class ReviewPageController {
    public String token { get; set; }
    public Boolean invalidToken { get; set; }
    
    public String reviewerName { get; set; }
    public String comments { get; set; }
    public Integer rating { get; set; }
    
    private Order__c currentOrder;

    public ReviewPageController() {
        token = ApexPages.currentPage().getParameters().get('token');
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

        if (orders.isEmpty() || orders[0].Review_Submitted__c) {
            invalidToken = true;
        } else {
            currentOrder = orders[0];
            invalidToken = false;
        }
    }

    public PageReference submitReview() {
        if (invalidToken || currentOrder == null) {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Invalid or expired link.'));
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

        return null;
    }
}
