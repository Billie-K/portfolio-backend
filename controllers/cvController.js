const CV = require('../models/cv');
const { mlPdfParser, mlDocxParser } = require('../utils/mlParser'); 

// Example middleware for handling file uploads with multer
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory buffer
const upload = multer({ storage: storage });
const fs = require('fs');
const { extractCVDataFromPDF } = require('../utils/gptParser');
const path = require('path');

// Define paths to the example files
const pdfFilePath = path.join(__dirname, 'files', 'example.pdf');
const docxFilePath = path.join(__dirname, 'files', 'example2.docx');

// Upload and parse CV
const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(201).json({ message: 'CV uploaded successfully' });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ message: 'Error uploading CV', error });
  }
};

// Get CV data for a user
const getCV = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have user info in req.user after authentication

    // Fetch CV data for the authenticated user
    const cv = await CV.findOne({ user: userId });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ message: 'Error fetching CV', error });
  }
};

// Parse CV with chatGPT
const gptParse = async (req, res) => {
  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync('example.pdf', { encoding: null }); // Use { encoding: null } to read as buffer

    // Convert buffer to base64 (required by OpenAI API)
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    // Request CV data extraction from GPT
    const extractedData = await extractCVDataFromPDF(pdfBase64);

    console.log('Extracted CV Data:\n', extractedData);
  } catch (error) {
    console.error('Error:', error);
  }
}

const mlParsePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path; // Assuming req.file.path contains the file path
    const data = await mlPdfParser(filePath);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ message: 'Error parsing PDF', error: error.message });
  }
}

const mlParseDOCX = async (req, res) => {
  try {
    const data = await mlDocxParser(docxFilePath);
    res.json(data)
  } catch (error) {
    console.error('Error', error)
  }
}

module.exports = {uploadCV, getCV, gptParse, mlParsePDF, mlParseDOCX}