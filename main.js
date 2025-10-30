// imports 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5500;

// db connection
// Support multiple environment variable names and provide a sensible default when running in Docker
const DB_URI = process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://db:27017/pollapp';

// In test mode we skip connecting to the real database so tests can import the app
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log(`Connected to MongoDB: ${DB_URI}`))
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        // Crash the process so Docker / nodemon can restart or show the error in logs.
        process.exit(1);
    });
} else {
    console.log('Test environment detected — skipping MongoDB connection');
}

// middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({secret: 'my secreat key',saveUninitialized:true,resave: false}));
app.use(express.static('uploads'));
app.use((req, res, next)=>{
    res.locals.message = req.session.message; 
    delete req.session.message;
    next();
});

// set templete engine
app.set('view engine', 'ejs');


// route prefix
app.use("", require('./routes/routes'))

// Only start the server when not running tests
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, ()=>{console.log(`Server Started. Url: http://localhost:${PORT}`);});
}

// Export app for testing
module.exports = app;