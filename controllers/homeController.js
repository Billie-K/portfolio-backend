require('dotenv').config();

exports.welcome = (req, res) => {
    res.send("Welcome to Portfol.io API!")
}