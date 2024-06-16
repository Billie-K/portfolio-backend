const Portfolio = require('../models/portfolio');

exports.createPortfolio = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, sections } = req.body;

    const newPortfolio = new Portfolio({ user: userId, title, sections });
    await newPortfolio.save();

    res.status(201).json({ message: 'Portfolio created successfully', portfolio: newPortfolio });
  } catch (error) {
    res.status(500).json({ message: 'Error creating portfolio', error });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const { userId } = req.user;
    const portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error });
  }
};
