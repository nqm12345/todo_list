import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/modules/auth/auth.model.js';

// Load environment variables
dotenv.config();

const deleteUser = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Delete user by email
    const email = process.argv[2];
    
    if (!email) {
      console.error('❌ Usage: node scripts/delete-user.js <email>');
      process.exit(1);
    }

    const result = await User.deleteOne({ email: email.toLowerCase().trim() });
    
    if (result.deletedCount > 0) {
      console.log(`✅ Deleted user: ${email}`);
    } else {
      console.log(`⚠️  User not found: ${email}`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Done! MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

deleteUser();
