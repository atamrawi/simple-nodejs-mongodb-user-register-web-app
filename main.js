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

app.listen(PORT, ()=>{console.log(`Server Started. Url: http://localhost:${PORT}`);});