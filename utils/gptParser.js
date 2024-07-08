require('dotenv').config();
const axios = require('axios');
const OpenAI = require("openai");

const OPENAI_ENGINE = 'davinci-codex'; // GPT-4 model fine-tuned for code and document processing

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function extractCVDataFromPDF(pdfText) {
  try {
    const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: `Extract the following information from the resume:\n\n${pdfText}\n\nName: [Name]\nEmail: [Email]\nPhone number: [Phone number]\nExperience: [Experience]\nEducation: [Education]`,
          max_tokens: 200,
          temperature: 0.5,
          stop: ['\n']
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
    );
  
    const extractedText = response.data.choices[0].text.trim();
    return extractedText;
  } catch (error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with a non-success status code:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request made but no response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error setting up the request:', error.message);
      }
      throw error; // Rethrow the error for further handling
  }
}

module.exports = { extractCVDataFromPDF };
