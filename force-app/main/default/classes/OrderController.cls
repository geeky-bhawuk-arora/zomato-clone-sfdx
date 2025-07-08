public with sharing class OrderController {
    @AuraEnabled
    public static Id placeOrder(Id restaurantId, String customerName, String itemsJson) {
        List<Object> items = (List<Object>) JSON.deserializeUntyped(itemsJson);

        Set<Id> menuItemIds = new Set<Id>();
        Map<Id, Integer> menuItemQuantities = new Map<Id, Integer>();

        for (Object item : items) {
            Map<String, Object> m = (Map<String, Object>) item;
            Id menuItemId = (String) m.get('menuItemId');
            Integer qty = Integer.valueOf(m.get('quantity'));
            menuItemIds.add(menuItemId);
            menuItemQuantities.put(menuItemId, qty);
        }

        Map<Id, Menu_Item__c> menuItemMap = new Map<Id, Menu_Item__c>(
            [SELECT Id, Price__c FROM Menu_Item__c WHERE Id IN :menuItemIds]
        );

        Order__c order = new Order__c(
            Restaurant__c = restaurantId,
            Name = customerName,
            Total_Price__c = 0
        );
        insert order;

        Decimal total = 0;
        List<Order_Item__c> orderItems = new List<Order_Item__c>();

        for (Id menuItemId : menuItemIds) {
            if (!menuItemMap.containsKey(menuItemId)) continue;

            Menu_Item__c menuItem = menuItemMap.get(menuItemId);
            Integer qty = menuItemQuantities.get(menuItemId);
            total += menuItem.Price__c * qty;

            orderItems.add(new Order_Item__c(
                Order__c = order.Id,
                Menu_Item__c = menuItem.Id,
                Quantity__c = qty
                // no Price__c field here
            ));
        }

        order.Total_Price__c = total;
        update order;
        insert orderItems;

        return order.Id;
    }
}
