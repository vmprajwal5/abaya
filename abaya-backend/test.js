require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB connection...');
console.log('📍 Connecting to:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ SUCCESS! Connected to MongoDB');
        console.log('🎉 You can now seed your database');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ FAILED! Error:', err.message);
        console.error('\n💡 Check:');
        console.error('   1. Is password correct in .env?');
        console.error('   2. Did you add /abaya-store to the URI?');
        console.error('   3. Is 0.0.0.0/0 whitelisted in MongoDB Atlas?');
        process.exit(1);
    });