import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

import { Medicine } from '../models/Medicine';
import { MedicalTest } from '../models/MedicalTest';
import { Disease } from '../models/Disease';
import { User } from '../models/User';
import { Admin } from '../models/Admin';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediplain';

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Clear existing database by dropping it to clean legacy indexes
    console.log('Dropping existing database to clean indexes...');
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log('Database dropped.');
    } else {
      await User.deleteMany({});
      await Admin.deleteMany({});
      await Medicine.deleteMany({});
      await MedicalTest.deleteMany({});
      await Disease.deleteMany({});
      console.log('Cleared existing data collections.');
    }

    // 2. Load Seed Data from JSON
    const dataDir = path.join(__dirname, 'data');
    
    const medicinesData = JSON.parse(
      fs.readFileSync(path.join(dataDir, 'medicines.json'), 'utf-8')
    );
    const testsData = JSON.parse(
      fs.readFileSync(path.join(dataDir, 'tests.json'), 'utf-8')
    );
    const diseasesData = JSON.parse(
      fs.readFileSync(path.join(dataDir, 'diseases.json'), 'utf-8')
    );

    // 3. Seed Medicines
    console.log(`Seeding ${medicinesData.length} medicines...`);
    await Medicine.insertMany(medicinesData);

    // 4. Seed Medical Tests
    console.log(`Seeding ${testsData.length} medical tests...`);
    await MedicalTest.insertMany(testsData);

    // 5. Seed Diseases
    console.log(`Seeding ${diseasesData.length} diseases...`);
    await Disease.insertMany(diseasesData);

    // 6. Seed default User & Admin
    console.log('Seeding default User & Admin accounts...');
    const salt = await bcrypt.genSalt(10);
    const defaultUserPasswordHash = await bcrypt.hash('user123', salt);
    const defaultAdminPasswordHash = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'John Doe',
      email: 'user@mediplain.com',
      passwordHash: defaultUserPasswordHash,
      role: 'user',
      language: 'en',
      theme: 'light'
    });

    await Admin.create({
      name: 'System Admin',
      email: 'admin@mediplain.com',
      passwordHash: defaultAdminPasswordHash
    });

    // Also create the admin in User table for double safety if they log in via standard user login
    await User.create({
      name: 'System Admin',
      email: 'admin@mediplain.com',
      passwordHash: defaultAdminPasswordHash,
      role: 'admin',
      language: 'en',
      theme: 'dark'
    });

    console.log('Seeding process completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();
