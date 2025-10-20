import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/modules/auth/auth.model.js';

// Load environment variables
dotenv.config();

const rebuildIndexes = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Drop existing indexes (except _id)
    console.log('🗑️  Dropping old indexes...');
    await User.collection.dropIndexes();
    console.log('✅ Old indexes dropped');

    // Rebuild indexes from schema
    console.log('🔨 Rebuilding indexes...');
    await User.syncIndexes();
    console.log('✅ Indexes rebuilt successfully');

    // List all indexes
    const indexes = await User.collection.getIndexes();
    console.log('\n📋 Current indexes:');
    console.log(JSON.stringify(indexes, null, 2));

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Done! MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

rebuildIndexes();
