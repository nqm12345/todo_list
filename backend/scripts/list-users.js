import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/modules/auth/auth.model.js';

// Load environment variables
dotenv.config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({}).select('-password');
    
    console.log(`📋 Total users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${user.createdAt || 'N/A'}`);
      console.log('');
    });

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Done! MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listUsers();
