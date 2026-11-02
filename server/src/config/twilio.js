const twilio = require('twilio');
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log(' Twilio SMS: ENABLED');
} else {
  console.log(' Twilio SMS: DISABLED');
}
module.exports = twilioClient;