const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        sparse: true  // This allows null values and only enforces uniqueness for non-null values
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'ended'],
        default: 'active'
    },
    auctionEndTime: {
        type: Date,
        required: true
    },
    finalPrice: {
        type: Number,
        default: null
    },
    winningBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);