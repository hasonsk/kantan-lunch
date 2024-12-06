import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const mailConfig = {
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
};
