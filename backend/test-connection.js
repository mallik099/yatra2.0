import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB Atlas connection...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful!');
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n🔧 Fix: Add your IP to MongoDB Atlas Network Access');
      console.log('   1. Go to https://cloud.mongodb.com');
      console.log('   2. Network Access → Add IP Address');
      console.log('   3. Use 0.0.0.0/0 for all IPs');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🔧 Fix: Check database user credentials');
      console.log('   1. Database Access → Verify user exists');
      console.log('   2. Username: karnamabhinaya8_db_user');
      console.log('   3. Password: Password123');
    }
    
    process.exit(1);
  }
};

testConnection();