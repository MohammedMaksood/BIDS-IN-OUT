const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// Serve static files from images folder
app.use('/images', express.static(path.join(__dirname, '../images')));
// Serve static files from src folder
app.use(express.static(path.join(__dirname, '../src')));

// MongoDB Connection with debug logs
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('\n=== Server Status ===');
        console.log('✅ MongoDB Connected Successfully');
        console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
        console.log('\n=== Application URLs ===');
        console.log('🌐 Local: http://localhost:5000');
        console.log('🔄 Live Server can also be used as an alternative\n');
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
    });

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Import models
const Product = require('./Product');
const Bid = require('./Bid');

// Initialize products if they don't exist
async function initializeProducts() {
    try {
        // First, remove all existing products
        await Product.deleteMany({});
        
        const products = [
            {
                productId: 'NIKE001',
                name: 'Nike AirMax',
                description: '1 month old With Box and Original laces are available',
                startingPrice: 49,
                currentPrice: 49,
                image: '/images/shoe.jpg',
                status: 'active',
                auctionEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            },
            {
                productId: 'PERF001',
                name: 'Giorgio Armani Perfume',
                description: 'Brand new Giorgio Armani perfume, never used',
                startingPrice: 99,
                currentPrice: 99,
                image: '/images/perfume.jpg',
                status: 'active',
                auctionEndTime: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours from now
            },
            {
                productId: 'PS5001',
                name: 'PlayStation',
                description: 'PlayStation 5 with 2 controllers and 3 games',
                startingPrice: 499,
                currentPrice: 499,
                image: '/images/ps.jpg',
                status: 'active',
                auctionEndTime: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours from now
            },
            {
                productId: 'CAM001',
                name: 'Polaroid Camera',
                description: 'Vintage Polaroid camera in excellent condition',
                startingPrice: 199,
                currentPrice: 199,
                image: '/images/camera.jpg',
                status: 'active',
                auctionEndTime: new Date(Date.now() + 96 * 60 * 60 * 1000) // 96 hours from now
            }
        ];
        
        // Create all products
        await Product.insertMany(products);
        
        console.log('Products initialized successfully');
    } catch (error) {
        console.error('Error initializing products:', error);
    }
}

// Call initializeProducts when server starts
initializeProducts();

// Register Route
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.username === username ? 
                    'Username already exists' : 
                    'Email already registered' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user to database
        const savedUser = await user.save();
        console.log('User saved successfully:', savedUser);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('Login attempt for:', req.body.username); // Debug log
        
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Invalid password for user:', username);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('Login successful for:', username);

        // Send success response
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Product Routes
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please upload an image' 
            });
        }

        const product = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: `/images/${req.file.filename}`
        });

        const savedProduct = await product.save();
        console.log('Product saved:', savedProduct);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: savedProduct
        });
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get product by number (1-4)
app.get('/api/products/:number', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: 1 });
        const index = parseInt(req.params.number) - 1;
        if (index >= 0 && index < products.length) {
            res.json({ success: true, product: products[index] });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Place a bid
app.post('/api/bids', verifyToken, async (req, res) => {
    try {
        const { productId, amount } = req.body;
        const userId = req.user.userId; // Get user ID from verified token

        // Get the actual product ID from the product number
        const products = await Product.find({}).sort({ createdAt: 1 });
        const index = parseInt(productId) - 1;
        if (index < 0 || index >= products.length) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const product = products[index];

        // Create the bid
        const bid = new Bid({
            product: product._id,
            bidder: userId,
            amount: amount
        });

        await bid.save();

        res.status(201).json({
            success: true,
            message: 'Bid placed successfully',
            bid: bid
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({
            success: false,
            message: 'Error placing bid',
            error: error.message
        });
    }
});

// Get bids for a product
app.get('/api/products/:productId/bids', async (req, res) => {
    try {
        // Get the actual product ID from the product number
        const products = await Product.find({}).sort({ createdAt: 1 });
        const index = parseInt(req.params.productId) - 1;
        if (index < 0 || index >= products.length) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const product = products[index];

        const bids = await Bid.find({ product: product._id })
            .populate('bidder', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bids: bids
        });
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bids',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server started successfully`);
    console.log('===========================================');
});