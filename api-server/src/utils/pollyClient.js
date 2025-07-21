const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
require('dotenv').config();

const client = new PollyClient({
    // eu-west-1 is ireland
  region: "us-east-1", // N. Virginia for long-form/generative voices 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN, // Optional, if using temporary credentials
  },
});

module.exports = client; // Export the Polly client for use in other modules