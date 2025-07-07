public with sharing class RestaurantController {
    // public RestaurantController() {

    // }

    @AuraEnabled(cacheable=true)
    public static List<Restaurant__c> getRestaurants(String cuisine, Decimal minRating) {
        return [
            SELECT Id, Name, Cuisine__c, Rating__c, Is_Open__c
            FROM Restaurant__c
            WHERE Is_Open__c = true
            AND Cuisine__c = :cuisine
            AND Rating__c >= :minRating
        ];
    }
}