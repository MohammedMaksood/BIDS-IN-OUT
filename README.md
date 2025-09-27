# BIDS IN & OUT - Online Auction Platform

A full-stack web application for online auctions where users can bid on products in real-time. This project was developed as a final year college project demonstrating modern web development practices.

## Live Demo

🔗 **Live Application:** [Coming Soon - Will be hosted on Netlify]

## Features

- **User Authentication:** Secure registration and login system with JWT tokens
- **Product Listings:** Browse available auction items with detailed information
- **Real-time Bidding:** Place bids on products with live updates
- **Auction Timer:** Track remaining time for each auction
- **User Dashboard:** View bidding history and manage account
- **Responsive Design:** Works seamlessly on desktop and mobile devices
- **Secure Backend:** MongoDB database with encrypted passwords using bcrypt

## Tech Stack

### Frontend
- HTML5
- CSS3 (with responsive design)
- JavaScript (Vanilla JS)
- AOS (Animate On Scroll)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- Bcrypt.js for password hashing
- Multer for image uploads
- CORS for cross-origin requests

## Project Structure

```
BIDS-IN-OUT/
├── src/                    # Frontend HTML pages
│   ├── index.html         # Home page
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── buyer-page.html    # Buyer dashboard
│   ├── product1-4.html    # Individual product pages
│   ├── listing-itempage.html
│   └── about.html         # About page
├── models/                # Backend models and server
│   ├── server.js          # Express server configuration
│   ├── User.js            # User model
│   ├── Product.js         # Product model
│   └── Bid.js             # Bid model
├── config/                # Configuration files
├── images/                # Product images and assets
├── .env                   # Environment variables (not in repo)
├── .env.example           # Example environment configuration
├── package.json           # Node.js dependencies
└── README.md             # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohammedMaksood/BIDS-IN-OUT.git
   cd BIDS-IN-OUT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

4. **Start the server**
   ```bash
   node models/server.js
   ```

5. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:number` - Get specific product (1-4)
- `POST /api/products` - Create new product (with image upload)

### Bidding
- `POST /api/bids` - Place a bid (requires authentication)
- `GET /api/products/:productId/bids` - Get all bids for a product

## Usage

1. **Register/Login:** Create an account or login with existing credentials
2. **Browse Products:** View available auction items on the home page
3. **Place Bids:** Click on a product and place your bid
4. **Track Auctions:** Monitor auction timers and current bid prices
5. **View Dashboard:** Check your bidding activity and account details

## Screenshots

[Screenshots will be added here]

## Default Products

The application comes with 4 pre-configured products:
1. Nike AirMax - Athletic footwear
2. Giorgio Armani Perfume - Luxury fragrance
3. PlayStation 5 - Gaming console with accessories
4. Polaroid Camera - Vintage photography equipment

## Security Features

- Password encryption using bcrypt
- JWT-based authentication
- Environment variables for sensitive data
- CORS protection
- Input validation and sanitization

## Future Enhancements

- [ ] Email notifications for bid updates
- [ ] Payment gateway integration
- [ ] Admin panel for product management
- [ ] Advanced search and filtering
- [ ] User ratings and reviews
- [ ] Auction history and analytics
- [ ] Socket.io for real-time bid updates
- [ ] Mobile app version

## Development

This project was developed as a final year college project in February 2025. It demonstrates:
- Full-stack JavaScript development
- RESTful API design
- Database design and management
- User authentication and authorization
- Frontend-backend integration
- Responsive web design

## Contributing

This is an academic project, but suggestions and feedback are welcome!

## License

This project is open source and available for educational purposes.

## Contact

**Mohammed Maksood**

- GitHub: [@MohammedMaksood](https://github.com/MohammedMaksood)
- Project Repository: [BIDS-IN-OUT](https://github.com/MohammedMaksood/BIDS-IN-OUT)

---

⭐ If you found this project helpful, please consider giving it a star!

**Developed with ❤️ as a College Final Year Project - February 2025**