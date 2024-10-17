const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const AdminRoutes = require('./routes/admin');

const app = express();
const PORT = 3001;  // Running admin app on port 3001

// Connect to YelpCamp Database
mongoose.connect('mongodb://127.0.0.1:27017/villas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/admin'));
app.use(express.static(path.join(__dirname, 'public/admin')));

// Routes
app.use('/admin', AdminRoutes);

app.listen(PORT, () => {
    console.log(`Admin app running on port ${PORT}`);
});
