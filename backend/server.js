require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const errorHandler = require('./middleware/errorHandler');
const seedProducts = require('./utils/seedProducts');

const app = express();

// Connect to MongoDB then seed
connectDB().then(() => seedProducts());

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/upload', uploadRoutes);

// Make uploads statically accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
    res.json({ message: '🎨 ArtisanHub API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
