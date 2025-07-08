public with sharing class ReviewController {
    @AuraEnabled
    public static void saveReview(Id restaurantId, String name, Integer rating, String comment) {
        Review__c r = new Review__c();
        r.Restaurant__c = restaurantId;
        r.Name = name;
        r.Rating__c = rating;
        r.Comment__c = comment;
        insert r;
    }

    @AuraEnabled(cacheable=true)
    public static List<Review__c> getReviews(Id restaurantId) {
        return [SELECT Id, Name, Rating__c, Comment__c FROM Review__c WHERE Restaurant__c = :restaurantId ORDER BY CreatedDate DESC];
    }
}
