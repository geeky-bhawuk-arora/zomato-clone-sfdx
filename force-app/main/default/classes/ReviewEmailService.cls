public class ReviewEmailService {
    public static void sendReviewEmail(Id orderId) {
        Order__c order = [
            SELECT Id, Review_Link_Token__c, Restaurant__r.Name
            FROM Order__c
            WHERE Id = :orderId
            LIMIT 1
        ];

        String reviewUrl = 'https://resilient-panda-q2ye5h-dev-ed--c.trailblaze.vf.force.com/reviewPage?token=' + order.Review_Link_Token__c;

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { 'bhawukarora042@gmail.com' });
        mail.setSubject('We’d love your feedback!');
        mail.setPlainTextBody(
            'Hi,\n\n' +
            'Thanks for your order at ' + (order.Restaurant__r != null ? order.Restaurant__r.Name : 'our restaurant') + '.\n\n' +
            'Click below to leave a review:\n' +
            reviewUrl + '\n\n' +
            'This link can only be used once.\n\nThanks!'
        );

        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
}
