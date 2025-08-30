const { invokeAI } = require('./invokeAI');

const invokeAIWithFallback = async ({
    req = null,
    messages,
    modelList = [
        'eu.anthropic.claude-sonnet-4-20250514-v1:0',
        'eu.anthropic.claude-3-5-sonnet-20240620-v1:0',
        'anthropic.claude-3-sonnet-20240229-v1:0',
        'anthropic.claude-3-haiku-20240307-v1:0'
        ], // array of model names in priority order
    temperature = 0.7,
    maxTokens = 5000
  }) => {
    let lastError = null;
  
    for (const model of modelList) {
      try {
        console.log(`Trying model: ${model}`);
        const result = await invokeAI({ req, messages, model, temperature, maxTokens });
        const usage = await result.response_metadata?.usage || {};
        usage.total_tokens = usage.input_tokens + usage.output_tokens;

        return {
            Content: result.content.trim(),
            Usage: usage,
            Model: modelName
        }; // success, return immediately
      } catch (err) {
        lastError = err;
        // Retry only on 429 (rate limit) errors
        if (err.response?.status === 429 || err.message.includes('429') || err.message.includes('Too many requests')) {
          console.warn(`Model ${model} hit rate limit, trying next model...`);
          continue; // try next model in the list
        } else {
          // If other error, stop immediately
          throw err;
        }
      }
    }
  
    // If all models failed
    throw new Error(`All models failed. Last error: ${lastError.message}`);
  };
  
module.exports = {
    invokeAIWithFallback
}