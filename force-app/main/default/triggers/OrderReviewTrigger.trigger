trigger OrderReviewTrigger on Order__c (after update) {
    List<Order__c> ordersToEmail = new List<Order__c>();

    for (Order__c ord : Trigger.new) {
        Order__c old = Trigger.oldMap.get(ord.Id);

        if (
            ord.Status__c == 'Delivered' &&
            old.Status__c != 'Delivered' &&
            !String.isBlank(ord.Review_Link_Token__c)
        ) {
            ordersToEmail.add(ord);
        }
    }

    for (Order__c ord : ordersToEmail) {
        try {
            ReviewEmailService.sendReviewEmail(ord.Id);
        } catch (Exception e) {
            System.debug('Email sending failed: ' + e.getMessage());
        }
    }
}