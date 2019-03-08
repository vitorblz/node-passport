const express = require('express');

const router = express.Router();

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to use this resourse');
  return res.redirect('/users/login');
}

router.get('/', (req, res) => {
  res.render('welcome');
});

router.get('/dashboard', isAuth, (req, res) => {
  res.render('dashboard', { name: req.user.name });
});

module.exports = router;
