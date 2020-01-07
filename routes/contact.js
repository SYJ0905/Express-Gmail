const express = require('express');
const router = express.Router(); 
const nodemailer = require('nodemailer');
const csrf = require('csurf');

// setup route middlewares
var csrfProtection = csrf({ cookie: true })

router.get('/', csrfProtection, function(req, res) {
  res.render('contact', { csrfToken: req.csrfToken() });
});
router.get('/review', function(req, res) {
  res.render('contactReview');
});
router.post('/post', csrfProtection, function(req, res) {
  const data = req.body;
  console.log(data);
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.NODEMAILER_USERNAME,
      clientId: process.env.NODEMAILER_CLIENTID,
      clientSecret: process.env.NODEMAILER_CLIENTSECRET,
      refreshToken: process.env.NODEMAILER_REFRESHTOKEN,
    },
  });
  const mailOptions = {
    from: `"來自蘇揚傑"<${process.env.NODEMAILER_USERNAME}>`,
    to: req.body.email,
    subject: `${req.body.username}寄了一封測試信`,
    text: req.body.description,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/contact/review');
  });
});
module.exports = router;