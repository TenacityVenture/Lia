// utils/modelMap.js
module.exports = {
  openai: {
    free: 'gpt-3.5-turbo',
    standard: 'gpt-3.5-turbo',
    pro: 'gpt-4',
  },
  bedrock: {
    free: 'anthropic.claude-3-haiku-20240307-v1:0',
    standard: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    pro: 'anthropic.claude-3-sonnet-20240229-v1:0',
  },
  
  mistral: {
    free: 'mistral-small',
    standard: 'mistral-medium',
    pro: 'mistral-large',
  },
  claude: {
    free: 'claude-3-haiku-20240307',
    standard: 'claude-3-sonnet-20240229',
    pro: 'claude-3-opus-20240229',
  },
  gemini: {
    free: 'gemini-1.0-pro',
    standard: 'gemini-1.5-pro-latest',
    pro: 'gemini-1.5-pro-latest',
  },
  // other providers like groq, llama, etc. I will add them later
  // as needed based on user plans
};
