const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

async function mlPdfParser(filePath) {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post(`${process.env.ML_API}/parse-cv`, form, {
            headers: form.getHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error parsing PDF:', error.message);
        throw error;
    }
}

async function gptPdfParser(filePath) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${process.env.ML_API}/parse-cv`, form, {
      headers: form.getHeaders()
    });

    return response.data;
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
    throw error;
  }
}

async function mlDocxParser(filePath) {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post('http://localhost:5000/parse-docx', form, {
            headers: form.getHeaders()
        });

        // console.log('Parsed DOCX Text:\n', response.data.text);
        // console.log('Extracted Entities:\n', response.data.entities);

        return response.data;
    } catch (error) {
        console.error('Error parsing DOCX:', error);
    }
}

module.exports = { mlPdfParser, mlDocxParser, gptPdfParser };

