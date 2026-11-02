require('dotenv').config();
const axios = require('axios');

async function testSMS() {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const phone = "8318230087"; // YOUR NUMBER

  console.log("API Key found:", apiKey ? "YES" : "NO");

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q',
        message: 'Test message from Cut For You!',
        numbers: phone,
      },
      {
        headers: { 
          authorization: apiKey, 
          'Content-Type': 'application/json' 
        },
      }
    );
    // If Fast2SMS accepts the request, it returns a success message and request_id
    console.log("✅ Fast2SMS Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Fast2SMS Error:", JSON.stringify(error.response?.data || error.message, null, 2));
  }
}

testSMS();