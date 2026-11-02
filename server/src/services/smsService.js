const nodemailer = require('nodemailer');
async function sendSMS(to, message) {
if (!to || !to.includes('@')) {
console.log(`Invalid email address: ${to}`);
return null;
}
try {
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});
const mailOptions = {
from: process.env.EMAIL_USER,
to: to,
subject: 'New Salon Booking Alert',
text: message,
};
const info = await transporter.sendMail(mailOptions);
console.log(`Email sent to ${to}: ${info.messageId}`);
return info;
} catch (error) {
console.error(`Email failed to ${to}:`, error.message);
return null;
}
}
async function notifyAllBarbers(message) {
const barberEmails = [
process.env.BARBER1_EMAIL,
process.env.BARBER2_EMAIL
].filter(Boolean);
const results = await Promise.all(
barberEmails.map(email => sendSMS(email, message))
);
return results;
}
module.exports = { sendSMS, notifyAllBarbers };