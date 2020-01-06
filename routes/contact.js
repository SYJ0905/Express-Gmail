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
      user: 'BetaPhoenixSNSD@gmail.com',
      clientId:
        '997919901780-d24i0cbsm7b9kedfdcjciartbovstk4q.apps.googleusercontent.com',
      clientSecret: 'No2CfohQGCWvKkIMej-sU_CL',
      refreshToken:
        '1//04XI29Ry7B6VICgYIARAAGAQSNwF-L9IrZxFS3xjKsAHhHKV5c7Us4wr4UdjNn20JutI4BO31lcXJRUE9lDRb1w7L45ovYUroyso',
    },
  });
  const mailOptions = {
    from: '"來自蘇揚傑"<BetaPhoenixSNSD@gmail.com>',
    to: 'CloudSu0905@gmail.com',
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