const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        // Try to connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful!');
        
        // Test creating a simple document
        const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
        await TestModel.create({ name: 'test' });
        console.log('✅ Database operations working!');
        
        // Clean up test document
        await TestModel.deleteMany({ name: 'test' });
        console.log('✅ Cleanup successful!');
        
        // Close connection
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully!');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
    }
}

// Run the test
testConnection(); 