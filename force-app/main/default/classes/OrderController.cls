public with sharing class OrderController {
    @AuraEnabled
    public static Id placeOrder(Id restaurantId, String customerName, String itemsJson) {
        List<Object> items = (List<Object>) JSON.deserializeUntyped(itemsJson);
        Order__c order = new Order__c(
            Restaurant__c = restaurantId,
            Customer_Name__c = customerName,
            Total_Amount__c = 0
        );
        insert order;

        Decimal total = 0;
        List<Order_Item__c> orderItems = new List<Order_Item__c>();

        for (Object item : items) {
            Map<String, Object> m = (Map<String, Object>) item;
            Decimal price = Decimal.valueOf(m.get('price'));
            Integer qty = Integer.valueOf(m.get('quantity'));
            total += price * qty;

            orderItems.add(new Order_Item__c(
                Order__c = order.Id,
                Menu_Item__c = (String) m.get('menuItemId'),
                Quantity__c = qty,
                Price__c = price
            ));
        }

        order.Total_Amount__c = total;
        update order;
        insert orderItems;

        return order.Id;
    }
}
