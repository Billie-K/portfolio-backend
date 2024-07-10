const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function mlPdfParser(filePath) {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post('https://portfoldevops.pythonanywhere.com/parse-pdf', form, {
            headers: form.getHeaders()
        });

        // console.log('Parsed PDF Text:\n', response.data.text);
        // console.log('Extracted Entities:\n', response.data.entities); 

        return response.data;
    } catch (error) {
        console.error('Error parsing PDF:', error.message);
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

module.exports = { mlPdfParser, mlDocxParser };

