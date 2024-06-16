const CV = require('../models/cv');
const { parsePDF, parseDOCX, extractInfo } = require('../utils/cvParser'); // Assuming you have a cvParser utility

// Example middleware for handling file uploads with multer
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory buffer
const upload = multer({ storage: storage });

// Upload and parse CV
exports.uploadCV = upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let parsedData;
    const fileBuffer = req.file.buffer; // Assuming multer stores file in buffer

    // Determine file type and parse accordingly
    if (req.file.mimetype === 'application/pdf') {
      parsedData = await parsePDF(fileBuffer);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      parsedData = await parseDOCX(fileBuffer);
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    // Extract relevant information from parsed data
    const extractedInfo = extractInfo(parsedData);

    // Save CV data to database
    const newCV = new CV({
      user: req.user.userId, // Assuming you have user info in req.user after authentication
      content: req.file.originalname, // Store filename or other relevant info
      parsed_data: extractedInfo,
    });

    await newCV.save();

    res.status(201).json({ message: 'CV uploaded and parsed successfully', cv: newCV });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ message: 'Error uploading CV', error });
  }
};

// Get CV data for a user
exports.getCV = async (req, res) => {
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
