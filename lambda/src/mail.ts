import { SQSEvent, Context, SQSRecord } from "aws-lambda";
import * as nodemailer from 'nodemailer';


// Configure Nodemailer to user Gmail
let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

function sendMail(message: SQSRecord) {
    console.log(message)
    let sqsMessage = JSON.parse(message.body);
    const emailMessage = {
        from: 'bogdanned32@gmail.com',    // Sender address
        to: sqsMessage.userEmail,     // Recipient address
        subject: 'Order Received: ' + sqsMessage.id,    // Subject line
        html: `<p>Hi ${sqsMessage.userEmail}.</p. <p>Your order of ${sqsMessage.itemsQuantity} ${sqsMessage.itemName} has been received and is being processed.</p> <p> Thank you for shopping with us! </p>` // Plain text body
    };

    transport.sendMail(emailMessage, (err: Error | null, info: any) => {
        if (err) {
            console.log(`EmailsSvc | ERROR: ${err}`)
        } else {
            console.log(`EmailsSvc | INFO: ${info}`);
        }
    });
}

exports.handler = async function (
    event: SQSEvent,
    _context: Context
): Promise<any> {
    event.Records.forEach((record: SQSRecord) => {
        // const { body } = record;

        // console.log(body);

        sendMail(record)

    });
    return {};
};

export default exports.handler;
