// Import the AWS SDK
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
// Configure the region
AWS.config.update({ region: 'eu-central-1' });

// Create an SQS service object
const sqs = new AWS.SQS();
const queueUrl = process.env.SQS_URL;


// the new endpoint
module.exports = (app) => app.post('/order', (req, res) => {

    let orderData = {
        id: uuidv4(),
        'userEmail': req.body['userEmail'],
        'itemName': req.body['itemName'],
        'itemPrice': req.body['itemPrice'],
        'itemsQuantity': req.body['itemsQuantity']
    }

    let sqsOrderData = {
        MessageAttributes: {
            "id": {
                DataType: "String",
                StringValue: orderData.id
            },
            "userEmail": {
                DataType: "String",
                StringValue: orderData.userEmail
            },
            "itemName": {
                DataType: "String",
                StringValue: orderData.itemName
            },
            "itemPrice": {
                DataType: "Number",
                StringValue: orderData.itemPrice
            },
            "itemsQuantity": {
                DataType: "Number",
                StringValue: orderData.itemsQuantity
            }
        },
        MessageBody: JSON.stringify(orderData),
        MessageDeduplicationId: String(new Date().getTime()),
        MessageGroupId: "UserOrders",
        QueueUrl: queueUrl
    };
    console.log(sqsOrderData)
    // Send the order data to the SQS queue
    let sendSqsMessage = sqs.sendMessage(sqsOrderData).promise();

    sendSqsMessage.then((data) => {
        console.log(`OrdersSvc | SUCCESS: ${data.MessageId}`);
        res.send("Thank you for your order. Check you inbox for the confirmation email.");
    }).catch((err) => {
        console.log(`OrdersSvc | ERROR: ${err}`);

        // Send email to emails API
        res.send("We ran into an error. Please try again.");
    });
});