public with sharing class RestaurantController {
    // public RestaurantController() {

    // }

    @AuraEnabled(cacheable=true)
    public static List<Restaurant__c> getRestaurants(String cuisine, Decimal minRating, String keyword) {
        String key = '%' + keyword + '%';
        return [
            SELECT Id, Name, Cuisine__c, Rating__c, Address__c, Is_Open__c
            FROM Restaurant__c
            WHERE Is_Open__c = true
            AND Cuisine__c = :cuisine
            AND Rating__c >= :minRating
            AND Name LIKE :key
        ];
    }


    @AuraEnabled(cacheable=true)
    public static Restaurant__c getRestaurantDetails(Id restaurantId) {
        return [
            SELECT Id, Name, Cuisine__c, Rating__c, Address__c
            FROM Restaurant__c
            WHERE Id = :restaurantId
            LIMIT 1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Menu_Item__c> getMenuItems(Id restaurantId) {
        return [
            SELECT Id, Name, Price__c, Description__c
            FROM Menu_Item__c
            WHERE Restaurant__c = :restaurantId
        ];
    }
}