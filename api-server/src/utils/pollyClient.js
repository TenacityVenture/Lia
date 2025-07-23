const { PollyClient } = require("@aws-sdk/client-polly");
require('dotenv').config();

function createPollyClient() {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("Missing AWS credentials in environment variables.");
    }

    return new PollyClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    });
  } catch (error) {
    console.error("Failed to create Polly client:", error.message);
    return null;
  }
}

const client = createPollyClient();

module.exports = client;