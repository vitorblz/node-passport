const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

require('dotenv').config();

const passport = require('passport');
require('./config/passport')(passport);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(console.warn('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(expressLayouts);

// Expres Session
app.use(session({
  maxAge: 24 * 60 * 60 * 1000,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use(flash());

// setGlobalVarMessage
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// bodyparser
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
