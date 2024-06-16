const pdf = require('pdf-parse');
const mammoth = require('mammoth');

async function parsePDF(fileBuffer) {
  try {
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}

async function parseDOCX(fileBuffer) {
  try {
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    return value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw error;
  }
}

function extractInfo(text) {
  // Example of basic extraction of name and email
  const lines = text.split('\n');
  let name = '';
  let email = '';

  for (let line of lines) {
    line = line.trim();
    if (line.includes('@')) {
      email = line;
    } else if (line.match(/^[a-zA-Z\s]*$/)) {
      name = line;
    }
  }

  return { name, email };
}

module.exports = { parsePDF, parseDOCX, extractInfo };
