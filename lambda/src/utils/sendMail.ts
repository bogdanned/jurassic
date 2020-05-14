import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

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
      html: msg.text,
    });
  } catch (e) {
    console.error(e);
  }
};
