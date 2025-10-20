import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/modules/auth/auth.model.js';

// Load environment variables
dotenv.config();

const normalizeEmails = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({});
    console.log(`📋 Found ${users.length} users\n`);

    let updated = 0;
    for (const user of users) {
      const normalizedEmail = user.email.toLowerCase().trim();
      const normalizedUsername = user.username.trim();
      
      if (user.email !== normalizedEmail || user.username !== normalizedUsername) {
        console.log(`🔧 Normalizing user:`);
        console.log(`   Old email: "${user.email}" → New: "${normalizedEmail}"`);
        console.log(`   Old username: "${user.username}" → New: "${normalizedUsername}"`);
        
        user.email = normalizedEmail;
        user.username = normalizedUsername;
        await user.save();
        updated++;
        console.log(`   ✅ Updated!\n`);
      }
    }

    console.log(`\n✅ Normalized ${updated} users out of ${users.length}`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Done! MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

normalizeEmails();
