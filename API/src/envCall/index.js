import dotenv from 'dotenv';

dotenv.config();

const baseEnv = {
   MONGODB_URI: process.env.MONGODB_URI,
   MONGODB_URI_LOCAL: process.env.MONGODB_URI_LOCAL,
   MONGODB_URI_TEST: process.env.MONGODB_URI_TEST,
   SENDER_EMAIL: process.env.SENDER_EMAIL,
   RECEIVER_EMAIL: process.env.RECEIVER_EMAIL,
   SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
   BASE_URL: process.env.BASE_URL,
   PORT: process.env.PORT,
};
export default baseEnv;
