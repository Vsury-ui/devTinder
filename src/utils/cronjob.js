const cron = require("node-cron");
const connectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay } = require("date-fns");  
 
cron.schedule("0 19 * * *", () => {
    // send email to all people who got resuests the previous day
   
    try {
        // logic to send email to all people who got requests the previous day

        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = startOfDay(subDays(new Date(), 0));
        const pendingRequests = await connectionRequest.find({ status: "interested", createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } }).populate("fromUserId toUserId" );

        const listofEmails = [...new Set(pendingRequests.map((request) => request.toUserId.email))];

        for (const email of listofEmails) {
            // send email to email
            console.log("Email sent to: ", email);
        }
        // send email to all emails in listofEmails
        console.log("Emails to be sent to: ", listofEmails);

    }catch (err) {
        console.error("Error in cron job: ", err);
    }
});

module.exports = cron;
