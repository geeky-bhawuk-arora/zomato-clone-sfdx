public with sharing class OrderController {
    @AuraEnabled
    public static Id createOrder(String customerName, String address, String phone, List<Map<String, Object>> items) {
        Order__c order = new Order__c();
        order.Customer_Name__c = customerName;
        order.Address__c = address;
        order.Phone__c = phone;
        insert order;

        List<Order_Item__c> orderItems = new List<Order_Item__c>();
        for (Map<String, Object> item : items) {
            Order_Item__c oi = new Order_Item__c();
            oi.Order__c = order.Id;
            oi.Menu_Item__c = (String)item.get('Id');
            oi.Name = (String)item.get('Name');
            oi.Quantity__c = (Integer)item.get('Quantity');
            oi.Price__c = (Decimal)item.get('Price__c');
            oi.Line_Total__c = (Decimal)item.get('LineTotal');
            orderItems.add(oi);
        }
        insert orderItems;
        return order.Id;
    }
}