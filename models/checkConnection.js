const mongoose = require('mongoose');
require('dotenv').config();

async function diagnoseConnection() {
    try {
        // Test database connection
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Database connection successful');

        // Check if we can write to the database
        const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
        const testDoc = await TestModel.create({ name: 'test' });
        console.log('✅ Write operation successful:', testDoc);

        // Check if we can read from the database
        const readDoc = await TestModel.findOne({ name: 'test' });
        console.log('✅ Read operation successful:', readDoc);

        // Clean up
        await TestModel.deleteOne({ name: 'test' });
        console.log('✅ Delete operation successful');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Database operation failed:', error.message);
        if (error.name === 'MongooseServerSelectionError') {
            console.log('⚠️ Check your connection string and network connection');
        }
        if (error.name === 'MongoError' && error.code === 18) {
            console.log('⚠️ Authentication failed - check username/password');
        }
    }
}

diagnoseConnection(); 