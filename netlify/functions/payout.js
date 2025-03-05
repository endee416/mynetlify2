const axios = require("axios");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Method Not Allowed" }),
    };
  }

  try {
    const { amount, account_number, bank_code, vendorName, vendorId } = JSON.parse(event.body);
    if (!amount || !account_number || !bank_code || !vendorName || !vendorId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing required parameters" }),
      };
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: "No Paystack key" }),
      };
    }

    // Example: Resolve account
    const resolveRes = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return success just for demonstration
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: resolveRes.data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
