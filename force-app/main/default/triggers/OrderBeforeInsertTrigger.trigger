trigger OrderBeforeInsertTrigger on Order__c (before insert) {
    for (Order__c ord : Trigger.new) {
        if (String.isBlank(ord.Review_Link_Token__c)) {
            ord.Review_Link_Token__c = TokenUtil.generateSecureToken();
        }
    }
}