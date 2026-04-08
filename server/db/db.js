import mongoose from "mongoose";

const DEFAULT_RETRIES = 5;
const DEFAULT_DELAY_MS = 1000;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const connectToDatabase = async (retries = DEFAULT_RETRIES) => {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) throw new Error('MONGODB_URL is not set in environment');

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose.connect(mongoUrl);
            console.log('MongoDB connected');
            return mongoose.connection;
        } catch (err) {
            console.error(`MongoDB connection attempt ${attempt} failed:`, err.message || err);
            if (attempt === retries) {
                console.error('All MongoDB connection attempts failed');
                throw err;
            }
            const waitMs = DEFAULT_DELAY_MS * Math.pow(2, attempt - 1);
            console.log(`Retrying MongoDB connection in ${waitMs}ms...`);
            // eslint-disable-next-line no-await-in-loop
            await delay(waitMs);
        }
    }
};

export default connectToDatabase;