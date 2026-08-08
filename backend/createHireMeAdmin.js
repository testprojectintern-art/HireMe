import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const createHireMeAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Admin 1: admin@hireme.lk
        let admin1 = await User.findOne({ email: 'admin@hireme.lk' });
        if (admin1) {
            admin1.password = 'admin123';
            admin1.role = 'admin';
            admin1.isActive = true;
            await admin1.save();
        } else {
            admin1 = new User({
                firstName: 'HireMe',
                lastName: 'Admin',
                email: 'admin@hireme.lk',
                password: 'admin123',
                role: 'admin',
                isActive: true
            });
            await admin1.save();
        }

        // Admin 2: admin@admin.com
        let admin2 = await User.findOne({ email: 'admin@admin.com' });
        if (admin2) {
            admin2.password = 'password123';
            admin2.role = 'admin';
            admin2.isActive = true;
            await admin2.save();
        } else {
            admin2 = new User({
                firstName: 'Super',
                lastName: 'Admin',
                email: 'admin@admin.com',
                password: 'password123',
                role: 'admin',
                isActive: true
            });
            await admin2.save();
        }

        console.log('HireMe Admin Accounts successfully created/updated in MongoDB!');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin accounts:', err);
        process.exit(1);
    }
};

createHireMeAdmin();
