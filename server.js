'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const _ = require('underscore');

// Constants
const PORT = 8888;
const HOST = '0.0.0.0';

// App
const app = express();

const config = {
  subjectPrefix: process.env.SUBJECT || '[POSTMAIL]',
  authorizedOrigin: process.env.AUTHORIZED_ORIGIN,
  transporter: {
    email: process.env.TRANSPORTER_EMAIL,
    password: process.env.TRANSPORTER_PASSWORD
  },
  destinationEmail: process.env.DESTINATION_EMAIL
};


if(!config.transporter.email){
  console.error("Please set TRANSPORTER_EMAIL");
  return;
}

if(!config.transporter.password){
  console.error("Please set TRANSPORTER_PASSWORD");
  return;
}

if(!config.destinationEmail){
  console.error("Please set DESTINATION_EMAIL");
  return;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.transporter.email,
    pass: config.transporter.password
  }
});

if(config.authorizedOrigin) {
  app.use(function(req, res, next) {
    if (req.headers.origin.match(`^${config.authorizedOrigin}(:[0-9]+)?`) == null ) res.status(403).send('Unauthorized request');
    else next();
  });
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/postmail', function(req, res) {
  res.status(200).send("Service Available");
});

app.post('/postmail', function(req, res) {
  console.log(req.body);

  const subject = req.body.subject ? `${config.subjectPrefix} ${req.body.subject}` : config.subjectPrefix;

  const mail = {
    from: config.transporter.email,
    to: config.destinationEmail,
    subject: subject,
    text: `You've got mail: ${JSON.stringify(_.omit(req.body, 'redirect', 'subject'))}`
  };


  transporter.sendMail(mail, (err, info) => {
    if(err){
      console.error(err);
      return;
    }
    console.log(`Email sent: ${JSON.stringify(mail)}`)
  });

  if (req.body.redirect) {
    console.log(`Redirecting to : ${req.body.redirect}`)
    res.redirect(req.body.redirect);
    return;
  }
  res.status(200).send("Success");
  return;
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);