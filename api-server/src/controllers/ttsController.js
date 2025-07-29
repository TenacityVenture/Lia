
const crypto = require('crypto');

const {
  getUserQuota,
  findAudioCache,
  synthesizeToBuffer,
  uploadToS3,
  insertAudioCache,
  decrementUserQuota,
  logAudioUsage
} = require("../utils/ttsHelpers");


//* generate speech
//* log usage to usage table in supabase
//* return the audio file URL

// const pipe = promisify(pipeline);

exports.generateSpeech = async (req, res) => {
 try {

   const { text, voice, engine } = req.body;
   const userId = req.user?.sub;
   // console.log(userId)

   //* Validate input
   if (!text || !voice || !engine) {
     return res.status(400).json({ error: 'Missing required fields: text, voice, or engine' });
   }

   //* counting the characters in the text
   const charCount = text.length;
   const MAX_CHAR_LIMIT = 3000;

   //* Preventing unusually large requests
   if (charCount > MAX_CHAR_LIMIT) {
     return res.status(413).json({ error: `Text exceeds maximum allowed length of ${MAX_CHAR_LIMIT} characters` });
   }

   //* fetch user's usage tts character quota
   const quotaData = await getUserQuota(userId);

   //* Check for null or undefined quota
   if (quotaData.quota_left == null) {
     return res.status(403).json({
       error: "No TTS quota found; please upgrade or contact support.",
     });
   }

    //* check if quota is less than the charCount
   if (quotaData.quota_left < charCount) {
     return res.status(402).json({
       error: `Insufficient quota: have ${quotaData.quota_left}, need ${charCount}.`,
     });
   }

   //* Hashing the text and checking the cache table if cache exist
   const textHash = crypto.createHash('sha256')
     .update(text)
     .digest('hex');

   const cacheEntry = await findAudioCache(voice, engine, textHash);

   let audioUrl = "";
   let fromCache = false;

   //* if tts is cached return url
   if (cacheEntry) {
     //*  ✅ cache hit
     fromCache = true;
     audioUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${cacheEntry.s3_key}`;

     //* Log usage (no quota deduction)
     await logAudioUsage(userId, cacheEntry.id, text, voice, engine);

     return res.status(200).json({
       success: true,
       source: 'cache',
       audioUrl,
     });
   }

   //* if it's not cached generate tts and save to bucket
   console.log("\n-------------GENERATING SPEECH---------------\n")

   const audioBuffer = await synthesizeToBuffer(text, voice, engine);

   console.log("\n----------------SENDING AUDIO TO S3 URL---------------\n")

   //* Upload to S3 and insert cache row
   const s3Key = await uploadToS3(audioBuffer);

   const newCache = await insertAudioCache(voice, engine, textHash, s3Key);

   audioUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

  //* Deduct quota and log usage
   await decrementUserQuota(userId, charCount)
   await logAudioUsage(userId, newCache.id, text, voice, engine);

   //* return the audio url
   return res.status(200).json({
     success: true,
     source: "generated",
     audioUrl
   });

 } catch (err) {
   console.error("TTS generation failed:", err.message);
   return res.status(500).json({ error: "Internal Server Error" });
 }
};

