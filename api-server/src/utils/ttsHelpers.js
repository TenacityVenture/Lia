// services/ttsHelpers.js

const { SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { pollyClient, s3Client } = require('../utils/aws-sdks');
const supabase = require('../utils/supabaseClient');
const { v4: uuidv4 } = require("uuid")
const { streamToBuffer } = require('../utils/helpers');

//* Get user quota
async function getUserQuota(userId) {
  const { data, error } = await supabase
    .from('user_tts_quota')
    .select('quota_left')
    .eq('user_id', userId)
    .single();
  if (error) throw new Error(`getUserQuota error: ${error.message}`);
  return data;
}

//* Find global cache
async function findAudioCache(voice, engine, textHash) {
  const { data, error } = await supabase
    .from('tts_audio_cache')
    .select('s3_key')
    .eq('voice_id', voice)
    .eq('engine', engine)
    .eq('text_hash', textHash)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(`findAudioCache error: ${error.message}`);
  return data;
}

//* Synthesize text to buffer
async function synthesizeToBuffer(text, voice, engine) {
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: voice,
    Engine: engine,
  });
  const response = await pollyClient.send(command);
  return streamToBuffer(response.AudioStream);
}

//* Upload to S3
async function uploadToS3(audioBuffer) {
  const key = `tts-audio/${uuidv4()}.mp3`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: audioBuffer,
    ContentType: 'audio/mpeg',
    ContentLength: audioBuffer.length,
  });
  await s3Client.send(command);
  return key;
}

//* Insert into global cache
async function insertAudioCache(voice, engine, textHash, s3Key) {
  const { data, error } = await supabase
    .from('tts_audio_cache')
    .insert({ voice_id: voice, engine, text_hash: textHash, s3_key: s3Key })
    .single();
  if (error) throw new Error(`insertAudioCache error: ${error.message}`);
  return data;
}

//* Decrement user quota
async function decrementUserQuota(userId, amount) {
  const { error } = await supabase
    .rpc('decrement_quota', { uid: userId, used: amount });
  if (error) throw new Error(`decrementUserQuota error: ${error.message}`);
}

//* Log audio usage
async function logAudioUsage(userId, cacheId, text, voice, engine) {
  const { error } = await supabase
    .from('audio_usage')
    .insert({ user_id: userId, cache_id: cacheId, text, voice, engine });
  if (error) console.error(`logAudioUsage error: ${error.message}`);
}

module.exports = {
  getUserQuota,
  findAudioCache,
  synthesizeToBuffer,
  uploadToS3,
  insertAudioCache,
  decrementUserQuota,
  logAudioUsage
};
