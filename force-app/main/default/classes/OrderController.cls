public with sharing class OrderController {
    @AuraEnabled
    public static Id createOrder(String customerName, String address, String phone, List<Map<String, Object>> items) {
        Order__c order = new Order__c();
        order.Name = customerName;
        // order.Address__c = address;
        // order.Phone__c = phone;
        insert order;

        List<Order_Item__c> orderItems = new List<Order_Item__c>();
        for (Map<String, Object> item : items) {
            Order_Item__c oi = new Order_Item__c();
            oi.Order__c = order.Id;
            oi.Menu_Item__c = (String)item.get('Id');
            oi.Name = (String)item.get('Name');
            oi.Quantity__c = (Integer)item.get('Quantity');
            // oi.Price__c = (Decimal)item.get('Price__c');
            // oi.Line_Total__c = (Decimal)item.get('LineTotal');
            orderItems.add(oi);
        }
        insert orderItems;
        return order.Id;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, String> fetchCurrentUserData() {
        Map<String, String> result = new Map<String, String>();
        User u = [SELECT Id, Email, ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        result.put('email', u.Email);

        if (u.ContactId != null) {
            Contact c = [SELECT MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry FROM Contact WHERE Id = :u.ContactId LIMIT 1];
            String address = '';
            if (c.MailingStreet != null) address += c.MailingStreet + ', ';
            if (c.MailingCity != null) address += c.MailingCity + ', ';
            if (c.MailingState != null) address += c.MailingState + ', ';
            if (c.MailingPostalCode != null) address += c.MailingPostalCode + ', ';
            if (c.MailingCountry != null) address += c.MailingCountry;
            result.put('address', address);
        } else {
            result.put('address', '');
        }
        return result;
    }
}