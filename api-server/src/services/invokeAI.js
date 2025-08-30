// aiService.js - Unified AI abstraction layer
require('dotenv').config();

// LangChain imports
const { ChatOpenAI } = require("@langchain/openai");
const { ChatAnthropic } = require("@langchain/anthropic");
const { BedrockChat } = require("@langchain/community/chat_models/bedrock");
//const { RunnableSequence } = require('@langchain/core/runnables');
// Custom
const { getModelName } = require('../utils/helpers/modelSelector');


// Unified interface for invoking any provider
/**
 * Unified interface for invoking AI chat models from various providers (OpenAI, Anthropic, Bedrock).
 * Selects the appropriate provider and model, then sends messages for completion.
 *
 * @async
 * @function invokeAI
 * @param {Object} options - Options for invoking the AI model.
 * @param {Object} [options.req=null] - Optional request object, used for model selection.
 * @param {Array<Object>} options.messages - Array of message objects for the chat model.
 * @param {string} [options.model=null] - Optional model name to use; if not provided, selected via getModelName.
 * @param {number} [options.temperature=0.7] - Sampling temperature for the model.
 * @param {number} [options.maxTokens=1000] - Maximum number of tokens to generate.
 * @returns {Promise<Object>} - Returns an object containing the response content, usage metadata, and model name.
 * @throws {Error} If the provider is unsupported or not implemented.
 */
const invokeAI = async ({
  req = null,
  messages,
  model = null,
  temperature = 0.7,
  maxTokens = 10000
}) => {
  const modelName = model || await getModelName(req);
  const provider = detectProvider(modelName);
  console.log(`Invoking ${provider} model: ${modelName}`);

  let llm;
  switch (provider) {
    case 'openai':
      llm = new ChatOpenAI({
        modelName,
        temperature,
        maxTokens,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      break;

    case 'claude':
      llm = new ChatAnthropic({
        modelName,
        temperature,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      });
      break;

    case 'bedrock':
      llm = new BedrockChat({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        model: modelName,
        temperature
      });
      break;

    case 'supabase':
      throw new Error('Supabase chat models not supported via LangChain yet');

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  const result = await llm.invoke(messages);

  const usage = await result.response_metadata?.usage || {};
  usage.total_tokens = usage.input_tokens + usage.output_tokens;

  return {
    Content: result.content.trim(),
    Usage: usage,
    Model: modelName
  };
};

// Detect which provider a model belongs to
/**
 * Detects the provider for a given model name.
 *
 * @function detectProvider
 * @param {string} modelName - The name of the model.
 * @returns {string} - The provider name ('openai', 'claude', 'bedrock', or 'unknown').
 */
function detectProvider(modelName) {
  console.log(modelName)
  if (modelName.startsWith('gpt')) return 'openai';
  if (modelName.startsWith('anthropic.') || modelName.startsWith('eu.anthropic.')) return 'bedrock'; // AWS Bedrock Anthropic models
  if (modelName.startsWith('claude-')) return 'claude'; // Anthropic direct API
  return 'unknown';
}


module.exports = {
  invokeAI,
};