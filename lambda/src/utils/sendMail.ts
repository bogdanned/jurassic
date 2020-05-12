import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const msg = {
  to: "test@example.com",
  from: "test@example.com",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export default async (msg: EmailMessage) => {
  try {
    await sgMail.send({
      to: msg.to,
      from: "bogdanned32@gmail.com",
      subject: msg.subject,
      text: msg.text,
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    });
  } catch (e) {
    console.error(e);
  }
};
