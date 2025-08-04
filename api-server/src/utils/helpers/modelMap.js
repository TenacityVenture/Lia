// utils/modelMap.js
module.exports = {
  openai: {
    free: 'gpt-3.5-turbo',
    standard: 'gpt-3.5-turbo',
    pro: 'gpt-4',
  },
  bedrock: {
    free: 'anthropic.claude-3-haiku-20240307',
    standard: 'anthropic.claude-3-sonnet-20240229',
    pro: 'anthropic.claude-3-opus-20240229',
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
  // other providers like groq, llama, etc. I will add them later
  // as needed based on user plans
};
