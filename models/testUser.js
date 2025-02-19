const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testUserCreation() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // List all users
        const users = await User.find({});
        console.log('Current users in database:', users);

        // Create a test user
        const testUser = new User({
            username: 'testuser' + Date.now(),
            password: 'hashedpassword',
            role: 'buyer'
        });

        await testUser.save();
        console.log('Test user created:', testUser);

        // Verify user was saved
        const savedUser = await User.findOne({ username: testUser.username });
        console.log('Retrieved saved user:', savedUser);

        // Clean up
        await User.deleteOne({ username: testUser.username });
        console.log('Test user cleaned up');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testUserCreation(); 