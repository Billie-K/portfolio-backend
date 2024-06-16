const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');
const { developerLog } = require('../utils/logging');
require('dotenv').config();

const dbConnect = async () => {
	if (process.env.NODE_ENV === "test") {
		developerLog("Connecting to mock DB ...");
		const mockgoose = new Mockgoose(mongoose);
		try {
			await mockgoose.prepareStorage();
			await mongoose.connect(process.env.DATABASE);
			developerLog("Connected to Mock DB.");
		} catch (error) {
			developerLog('Error connecting to Mock DB:', error.message);
			throw error;
		}
	} else {
		try {
			await mongoose.connect(process.env.DATABASE);
			developerLog("Connected to Mongo DB.");
		} catch (error) {
			developerLog('Error connecting to db: ', error.message);
			throw error;
		}
	}
};

const dbClose = () => mongoose.disconnect();
module.exports = { dbConnect, dbClose };