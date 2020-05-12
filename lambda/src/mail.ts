import { SQSEvent, Context, SQSRecord } from "aws-lambda";
import sendMail from "./utils/sendMail";

exports.handler = async function (
  event: SQSEvent,
  _context: Context
): Promise<any> {
  console.log(process.env);
  await Promise.all(
    event.Records.map(async (record: SQSRecord) => {
      let sqsMessage = {
        id: "XXXX",
        userEmail: "default@default.com",
        itemName: "default product",
        itemPrice: "0",
        itemsQuantity: "0",
        ...JSON.parse(record.body),
      } as {
        userEmail: string;
        id: string;
        itemsQuantity: string;
        itemName: string;
      };

      try {
        await sendMail({
          to: sqsMessage.userEmail,
          subject: "Order Received: " + sqsMessage.id,
          text: `<p>Hi ${sqsMessage.userEmail}.</p. <p>Your order of ${sqsMessage.itemsQuantity} ${sqsMessage.itemName} has been received and is being processed.</p> <p> Thank you for shopping with us! </p>`, // Plain text body
        });
      } catch (e) {
        console.error(e);
      }
    })
  );
  return {};
};

export default exports.handler;
