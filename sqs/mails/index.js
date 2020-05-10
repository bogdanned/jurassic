const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Configure the region
AWS.config.update({ region: 'eu-central-1' });
dotenv.config();

const queueUrl = process.env.SQS_QUEUE_URL;

// Configure Nodemailer to user Gmail
let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

function sendMail(message) {
    console.log(message)
    let sqsMessage = JSON.parse(message.Body);
    const emailMessage = {
        from: 'bogdanned32@gmail.com',    // Sender address
        to: sqsMessage.userEmail,     // Recipient address
        subject: 'Order Received: ' + sqsMessage.id,    // Subject line
        html: `<p>Hi ${sqsMessage.userEmail}.</p. <p>Your order of ${sqsMessage.itemsQuantity} ${sqsMessage.itemName} has been received and is being processed.</p> <p> Thank you for shopping with us! </p>` // Plain text body
    };

    transport.sendMail(emailMessage, (err, info) => {
        if (err) {
            console.log(`EmailsSvc | ERROR: ${err}`)
        } else {
            console.log(`EmailsSvc | INFO: ${info}`);
        }
    });
}

// Create our consumer
const app = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: async (message) => {
        sendMail(message);
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

console.log('Emails service is running');
app.start();