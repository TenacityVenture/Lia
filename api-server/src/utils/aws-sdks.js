const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { S3Client } = require("@aws-sdk/client-s3");
require('dotenv').config();

const pollyClient = new PollyClient({
    // eu-west-1 is ireland
  region: "us-east-1", // N. Virginia for long-form/generative voices 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  },
});

// console.log('Polly client initialized with region:', pollyClient);


const s3Client = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  }
})

// console.log("S3Client initialized with region:", s3Client);


module.exports = {
  pollyClient,
  s3Client,
}