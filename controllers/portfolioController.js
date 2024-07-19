const Portfolio = require('../models/portfolio');
const {generateUniqueSlug} = require('../utils/generateUniqueSlug')

exports.createPortfolio = async (req, res) => {
  try {
    // const { userId } = req.user;
    let { fullName, email, phone, experience, education, skills, certifications, bio } = req.body;
    const slug = await generateUniqueSlug(fullName, Portfolio);

    const avatar = req.file ? req.file.path : null;
    experience = JSON.parse(experience)
    education = JSON.parse(education)

    const newPortfolio = new Portfolio({ 
      name: fullName,
      slug,
      email,
      phone,
      experience,
      education,
      skills,
      bio,
      certifications,
      avatar
    });
    await newPortfolio.save();

    res.status(201).json({ message: 'Portfolio created successfully', portfolio: newPortfolio });
  } catch (error) {
    res.status(500).json({ message: 'Error creating portfolio', error });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const { slug } = req.params;
    const portfolio = await Portfolio.findOne({ slug });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // const BASE_URL = process.env.BASE_URL;
    // const avatarPath = req.file ? req.file.path : null;
    // const avatarURL = avatarPath ? `${BASE_URL}/${avatarPath.split('/uploads/')[0]}` : null;

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error });
  }
};
