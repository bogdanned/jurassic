import { APIGatewayEvent, Context } from "aws-lambda"


export default async function (event: APIGatewayEvent, context: Context): Promise<any> {
    try {
        var method = event.httpMethod;

        if (method === "GET") {
            // GET / to get the names of all orders
            if (event.path === "/") {
                return {
                    statusCode: 200,
                    headers: {},
                    body: "success"
                };
            }
        }

        if (method === "POST") {
            // POST /name




        }

        if (method === "DELETE") {
            // DELETE /name

        }

    } catch (error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
            statusCode: 400,
            headers: {},
            body: body
        }
    }
}


