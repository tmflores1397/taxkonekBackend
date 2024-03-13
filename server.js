import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

admin.initializeApp();
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.post('/paymongo-webhook', (req, res) => {
  const eventData = req.body;

  // Implement logic to handle PayMongo webhook event
  console.log('PayMongo Webhook Data:', eventData);

  // You can add your logic to handle different PayMongo events here

  res.status(200).send('Webhook received successfully');
});

app.post('/send-email', upload.single('attachment'), (req, res) => {
  const formData = req.body;
  const attachment = req.file ? req.file.buffer : null;
  // Replace these values with your actual email credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tmflores1397@gmail.com',
      pass: 'vmcs klgp pueo kerd',
    },
  });
  const parsedData = JSON.parse(formData.data);

  const mailOptions = {
    from: 'tmflores1397@gmail.com',
    to: ['abujuguluy12@gmail.com', parsedData.emailAddress],
    subject: 'New Registration Form Submission',
    text: formatEmailContent(formData), // Use the formatted content here
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        content: attachment,
        filename: 'attachment.pdf', // You can customize the filename
      },
    ];
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent:');
      res.status(200).send('Email Sent Successfully');
    }
  });
});

function formatEmailContent(formData) {
    const parsedData = JSON.parse(formData.data);
  // Customize the formatting according to your preferences
  return `
    Date Registered: ${parsedData.dateRegistered}
    Status: ${parsedData.status}
    Client Code: ${parsedData.clientCode}
    File Code: ${parsedData.fileCode}
    Company Name: ${parsedData.companyName}
    Company Address: ${parsedData.companyAddress}
    Company TIN: ${parsedData.companyTIN}
    Business Formation: ${parsedData.businessFormation}
    Nature of Business: ${parsedData.natureOfBusiness}
    Filing Method: ${parsedData.filingMethod}
    Email Address: ${parsedData.emailAddress}
    First Name: ${parsedData.firstName}
    Last Name: ${parsedData.lastName}
    Mobile Number: ${parsedData.mobileNumber}
    Plan Code: ${parsedData.planCode}
    Plan Period: ${parsedData.planPeriod}
    Plan Rate: ${parsedData.planRate}
  `;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export const api = functions.https.onRequest(app);