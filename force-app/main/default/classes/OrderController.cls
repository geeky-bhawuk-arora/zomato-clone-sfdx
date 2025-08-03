public with sharing class OrderController {

    @AuraEnabled
    public static List<Id> createOrder(String customerName, String billingAddress, String phone, String additionalDetails, List<Map<String, Object>> items) {
        if (items == null || items.isEmpty()) {
            throw new AuraHandledException('Item list cannot be empty.');
        }

        Set<Id> menuItemIds = new Set<Id>();
        for (Map<String, Object> item : items) {
            menuItemIds.add((Id)item.get('Id'));
        }

        Map<Id, Menu_Item__c> menuItemMap = new Map<Id, Menu_Item__c>(
            [SELECT Id, Price__c, Restaurant__c, Restaurant__r.Name FROM Menu_Item__c WHERE Id IN :menuItemIds]
        );

        Map<Id, List<Map<String, Object>>> restaurantToItems = new Map<Id, List<Map<String, Object>>>();
        Map<Id, String> restaurantNames = new Map<Id, String>();

        for (Map<String, Object> item : items) {
            Id itemId = (Id)item.get('Id');
            Menu_Item__c mi = menuItemMap.get(itemId);
            if (mi == null || mi.Restaurant__c == null) continue;

            if (!restaurantToItems.containsKey(mi.Restaurant__c)) {
                restaurantToItems.put(mi.Restaurant__c, new List<Map<String, Object>>());
                restaurantNames.put(mi.Restaurant__c, mi.Restaurant__r.Name);
            }

            restaurantToItems.get(mi.Restaurant__c).add(item);
        }

        List<Id> createdOrderIds = new List<Id>();

        for (Id restId : restaurantToItems.keySet()) {
            List<Map<String, Object>> restItems = restaurantToItems.get(restId);
            Decimal totalAmount = 0;
            List<Order_Item__c> orderItems = new List<Order_Item__c>();
            List<String> orderDetailsLines = new List<String>();

            for (Map<String, Object> item : restItems) {
                Id itemId = (Id)item.get('Id');
                Menu_Item__c menuItem = menuItemMap.get(itemId);
                if (menuItem == null) continue;

                Integer qty = ((Decimal)item.get('Quantity')).intValue();
                Decimal price = menuItem.Price__c;
                Decimal lineTotal = price * qty;
                totalAmount += lineTotal;

                Order_Item__c oi = new Order_Item__c();
                oi.Menu_Item__c = itemId;
                oi.Name = (String)item.get('Name');
                oi.Quantity__c = qty;
                orderItems.add(oi);

                orderDetailsLines.add(oi.Name + ' x ' + qty + ' = ₹' + lineTotal.setScale(2));
            }

            Order__c order = new Order__c(
                Name = customerName,
                Billing_Address__c = billingAddress,
                Contact_No__c = phone,
                Additional_Details__c = additionalDetails,
                Total_Price__c = totalAmount,
                Status__c = 'Order Placed',
                Restaurant__c = restId
            );
            insert order;

            for (Order_Item__c oi : orderItems) {
                oi.Order__c = order.Id;
            }
            insert orderItems;

            order.Order_Details__c = String.join(orderDetailsLines, '\n');
            update order;

            createdOrderIds.add(order.Id);
        }

        return createdOrderIds;
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

    @AuraEnabled(cacheable=true)
    public static List<Order__c> getRestaurantOrders() {
        Id userId = UserInfo.getUserId();
        return [
            SELECT Id, Name, CreatedDate, Status__c, Comments__c, Additional_Details__c,
                   Contact_No__c, Billing_Address__c, Total_Price__c, Order_Details__c
            FROM Order__c
            WHERE Restaurant__r.OwnerId = :userId
            ORDER BY CreatedDate DESC
        ];
    }

    // ✅ Optimized: Single DML without SOQL
    @AuraEnabled
    public static void updateOrderStatus(Id orderId, String newStatus) {
        update new Order__c(Id = orderId, Status__c = newStatus);
    }

    // Optional: Uncomment when needed
    // @AuraEnabled(cacheable=true)
    // public static void sendOrderEmail(Id orderId) {
    //     Order__c order = [
    //         SELECT Id, Name, Customer__r.Email, Customer__r.Name, Status__c
    //         FROM Order__c WHERE Id = :orderId LIMIT 1
    //     ];
    //     if (order.Customer__r != null && String.isNotBlank(order.Customer__r.Email)) {
    //         Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    //         mail.setToAddresses(new String[] { order.Customer__r.Email });
    //         mail.setSubject('Your Order is Out for Delivery');
    //         mail.setPlainTextBody('Dear ' + order.Name + ',\n\nYour order ' + order.Name + ' is now out for delivery!\n\nThank you for ordering with us.');
    //         Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    //     }
    // }
}
