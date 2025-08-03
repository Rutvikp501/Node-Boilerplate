import express from 'express';
const router = express.Router();

import { cloudinaryUpload } from '../config/cloudinary.js';
import { generateCaptcha } from '../utils/generateCaptcha.js';
// import { s3Upload } from '../config/s3.js';

// router.post('/upload-s3', s3Upload.single('file'), (req, res) => {
//   res.send({ url: req.file.location });
// });

router.post('/upload-cloudinary', cloudinaryUpload.single('file'), (req, res) => {
  res.send({ url: req.file.path });
});

router.get('/captcha', (req, res) => {
  const captcha = generateCaptcha();
  req.session.captcha = captcha.text; // store in session
  res.type('svg');
  res.status(200).send(captcha.data);
});

router.post('/verify-captcha', (req, res) => {
  const { userInput } = req.body;

  if (userInput === req.session.captcha) {
    res.send({ success: true, message: 'CAPTCHA verified' });
  } else {
    res.send({ success: false, message: 'CAPTCHA incorrect' });
  }
});

// Your actual routes here
router.get("/test", (req, res) => {
  res.send("This is a test route.");
});


export default router;
