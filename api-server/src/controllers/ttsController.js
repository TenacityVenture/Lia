const supabase = require('../utils/supabaseClient');
const usageLogger = require('../services/usageLogger');

const {pollyClient, s3Client} = require('../utils/aws-sdks');
const { SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

const { v4: uuidv4 } = require("uuid")

// const fs = require('fs');
const crypto = require('crypto');
const {streamToBuffer} = require("../utils/helpers");


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
   const { data: usage, error: usageErr } = await supabase
     .from("usage")
     .select("char_quota_remaining")
     .eq("user_id", userId)
     .single();

   if (usageErr || !usage) {
     console.error("Quota fetch failed:", usageErr?.message);
     return res.status(500).json({ error: "Unable to retrieve character quota" });
   }

   //* Check for null or undefined quota
   if (usage.char_quota_remaining == null) {
     return res.status(403).json({
       error: "You don't have any TTS credits yet. Please upgrade or wait for reset.",
     });
   }

   //* check if quota is less than the charCount
   if (usage.char_quota_remaining < charCount) {
     return res.status(402).json({
       error: `You only have ${usage.char_quota_remaining} characters left, but this content needs ${charCount}.`,
       suggestion: "Please reduce the length of the content or upgrade your plan.",
     });
   }

   //* Hashing the text and checking the cache table if cache exist
   const textHash = crypto.createHash('sha256')
     .update(text)
     .digest('hex');

   const { data: cacheHit, error: cacheHitErr } = await supabase
     .from('tts_audio_cache')
     .select("s3_key")
     .eq("user_id", userId)
     .eq("voice_id", voice)
     .eq("text_hash", textHash)
     .eq("engine", engine)
     .single();

   let audioUrl = "";
   let fromCache = false;

   //* if tts is cached return url
   if (cacheHit) {
     fromCache = true;
     audioUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${cacheHit.s3_key}`
   }

   //* if it's not cached generate tts and save to bucket
   if(!fromCache) {
     //* Determine if we should use generative or standard/neural
     console.log("\n-------------GENERATING SPEECH---------------\n")
     const command = new SynthesizeSpeechCommand({
       Text: text,
       OutputFormat: 'mp3',
       VoiceId: voice,
       Engine: engine,
     });

     //* send the command to AWS Polly
     const response = await pollyClient.send(command);
     const audioStream = response.AudioStream;
     console.log(audioStream);
     console.log("\n----------------SPEECH GENERATED SUCCESSFULLY---------------\n")

     //* Pipe audio to local file (for now; replace this with S3 in next step)
     // await pipe(audioStream, fs.createWriteStream("test.mp3"));
     // console.log("Audio saved to test.mp3 ✅");

     console.log("\n----------------SENDING AUDIO TO S3 URL---------------\n")
     //* create the folder for the tts audio in s3
     const s3Key = `tts-audio/${uuidv4()}.mp3`;
     const audioBuffer = await streamToBuffer(audioStream);

     //* save to s3 bucket and return the URL
     const uploadCommand = new PutObjectCommand({
       Bucket: process.env.S3_BUCKET_NAME,
       Key: s3Key,
       Body: audioBuffer,
       ContentLength: audioBuffer.length,
       ContentType: "audio/mpeg"
     })

     await s3Client.send(uploadCommand);
     audioUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

     //* cache the tts audio
     await supabase.from('tts_audio_cache')
       .insert({
         user_id: userId,
         voice_id: voice,
         text_hash: textHash,
         engine: engine,
         s3_key: s3Key,
       });
   }

   //* deduct quota if new audio was generated
   if (!fromCache) {
     console.log("\n----------------DEDUCTING QUOTA REMAINING AND UPDATING---------------\n")
     //* subtract the remaining quota to that of the charCount and
     //* then update the char_quota_remaining column
     const newCharQuota = usage.char_quota_remaining - charCount;
     const { error: updateErr } = await supabase
       .from("usage")
       .update({ char_quota_remaining: newCharQuota })
       .eq("user_id", userId);

     if (updateErr) {
       console.error("Quota update failed:", updateErr.message);
       return res.status(500).json({ error: "Failed to update character quota" });
     }
   }

   //* log the usage in audio usage table
   const { error } = await supabase
     .from('audio_usage')
     .insert({
       user_id: userId,
       text,
       voice,
       engine
     });

   if (error) {
     console.error('Error logging audio usage:', error.message);
   }

     //* return the audio url
   return res.status(200).json({
     success: true,
     source: fromCache ? "tts-audio-cache" : "generated",
     audioUrl
   });

   // return res.status(200).json({ audioUrl: 'test.mp3' }); // {audioUrl: 'https://example.com/audio.mp3' };
   // return the audio file URL
 } catch (err) {
   console.error("TTS generation failed:", err.message);
   return res.status(500).json({ error: "Internal Server Error" });
 }
};

