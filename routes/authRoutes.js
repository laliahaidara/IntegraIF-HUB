const express = require('express');
const passport = require('passport');
const router = express.Router();

// Rota para login (GET)
router.get('/login', (req, res) => {
  console.log('Rendering auth/login');
  res.render('auth/login');
});



// Rota para login (POST)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Rota para logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');  // Redireciona após logout
  });
});

module.exports = router;