const { MessagingResponse } = require('twilio').twiml;
const axios = require('axios');
const Portfolio = require('../models/portfolio')

exports.parse = async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMsg = req.body.Body.trim(); // User's message

  console.log('message:', incomingMsg)

  try {
    // Step 1: Send the user's message to the Flask API for keyword extraction
    const response = await axios.post(`${process.env.ML_API}/whatsapp`, {
      message: incomingMsg
    });

    // Step 2: Get the parsed response with extracted fields
    const parsedData = response.data; // e.g., { job_title: 'web developer', location: 'Harare', experience: 5 }

    // Step 3: Build a MongoDB query dynamically based on parsed fields
    const query = {};
    if (parsedData.job_title) query.job_title = { $regex: new RegExp(parsedData.job_title, 'i') };
    if (parsedData.location) query.location = parsedData.location;
    if (parsedData.experience) query.experience = { $gte: parsedData.experience };
    if (parsedData.name) query.name = { $regex: new RegExp(parsedData.name, 'i') };

    console.log(query)

    // Step 4: Query MongoDB
    const result = await Portfolio.find(query).exec();

    if (result.length > 0) {
      let reply = 'Found the following matching candidates:\n';
      
      result.forEach(candidate => {
        reply += `Name: ${candidate.name},\n Email: ${candidate.email},\n Bio: ${candidate.bio},\n Phone: ${candidate.phone},\n Job Title: ${candidate.job_title},\n Skills: ${candidate.skills}\n\n`; // Added a newline for separation
      });
      
      // Limit the length of the reply if it's too long, as Twilio has message length restrictions.
      if (reply.length > 1500) {
        reply = reply.substring(0, 1500) + '...'; // Truncate and indicate continuation
      }
    
      twiml.message(reply); // Send the constructed reply
    } else {
      twiml.message('No candidates found with the given criteria.');
    }
  } catch (error) {
    console.error(error);
    twiml.message('An error occurred while processing your request.');
  }

  // Send the response back to Twilio
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};
