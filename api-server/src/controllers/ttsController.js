const pollyClient = require('../utils/pollyClient');
const { SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');

const fs = require('fs');
const { pipeline } = require("stream")
const { promisify } = require("util")


// generate speech
// log usage to usage table in supabase
// return the audio file URL

const pipe = promisify(pipeline);

exports.generateSpeech = async (req, res) => {
  //const userId = req.user.sub;
  const { text, voice, engine } = req.body;

  if (!text || !voice || !engine) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Determine if we should use generative or standard/neural
  let command;
  try {
    // Call AWS Polly to generate speech
    command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voice,
      Engine: engine, // AWS Polly generative engine
    });
    
  } catch (error) {
    console.error('TTS generation failed:', error.message);
    return res.status(500).json({ error: 'TTS generation failed' });
  }

  // send the command to AWS Polly
  const response = await pollyClient.send(command);

  console.log('TTS generation response:', response);
  
  const audioStream = response.AudioStream;

  await pipe(audioStream, fs.createWriteStream("test.mp3"));
  console.log("Audio saved to test.mp3 ✅");

  // save to s3 bucket and retun the URL 

  // Cache the audio file URL using supabase or any other storage solution

  // log the usage in audio usage table

  // return the audio url

  // log the usage in audo usage table
  /*const { error } = await supabase
    .from('audio_usage')
    .insert({
      user_id: userId,
      text,
      voice,
      engine,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error logging audio usage:', error.message);
  }*/

  return res.status(200).json({ audioUrl: 'test.mp3' }); // {audioUrl: 'https://example.com/audio.mp3' };
  // return the audio file URL
};
