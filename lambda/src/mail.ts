import { SQSEvent, Context } from "aws-lambda";

exports.handler = async function (
  event: SQSEvent,
  context: Context
): Promise<any> {
  event.Records.forEach((record) => {
    const { body } = record;
    console.log(body);
  });
  return {};
};

export default exports.handler;
