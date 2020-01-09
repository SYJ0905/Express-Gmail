const express = require('express');
const router = express.Router(); 
const nodemailer = require('nodemailer');
const csrf = require('csurf');
const { check, validationResult } = require('express-validator');

var validat = [
  check('email')
    .isEmail()
    .withMessage('Email 錯誤'),
  check('username')
    .isLength({ min: 2 })
    .withMessage('姓名不可低於 3 個字元'),
  check('description')
    .isLength({ min: 10 })
    .withMessage('字數不可少於 10 字元'),
];

// setup route middlewares
var csrfProtection = csrf({ cookie: true })

router.get('/', csrfProtection, function(req, res) {
  res.render('contact', {
    title: '信件發送頁面',
    csrfToken: req.csrfToken(),
    errorMessages: req.flash('errorMessages'),
  });
});
router.get('/review', function(req, res) {
  res.render('contactReview');
});
router.post('/post', [validat, csrfProtection], function(req, res) {
  const data = req.body;
  console.log(data);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errorMessages', errors.array());
    req.flash('errorMessages', errors.array());
    res.redirect('/contact');
  } else {
    console.log('驗證通過，記送信件');
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
        console.log('錯誤訊息:' + err);
        res.redirect('/contact');
      }
      res.redirect('/contact/review');
    });
  }
});
module.exports = router;