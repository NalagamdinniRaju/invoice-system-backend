require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoices');
const userRoutes = require('./routes/users');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);


const PORT = process.env.PORT || 5800;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));