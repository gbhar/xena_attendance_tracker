const { statusCodes } = require('./utils/constants');

exports.handler = async (event) => {
    console.log("Received event: ", event);
    const path = event.path.split('/')
    const queryParams = event.queryStringParameters
    const httpMethod = event.httpMethod;
    let responseName = '';
    let response = null;

    try {
        if (httpMethod === "GET") {
            responseName = queryParams?.name ? queryParams?.name : "Student"
            if (path && path[1] === "hello") {
                response = {
                    statusCode: statusCodes.OK,
                    body: `Hello, ${responseName}`
                }
            } else if (path && path[1] === "goodbye") {
                response = {
                    statusCode: statusCodes.OK,
                    body: `Goodbye, ${responseName}`
                }
            } else {
                response = {
                    statusCode: statusCodes.NOT_FOUND,
                    body: `Please use an allowed path.`
                }
            }
        } else {
            response = {
                statusCode: statusCodes.METHOD_NOT_ALLOWED,
                body: "Only GET requests are supported"
            }
        }
    } catch (error) {
        response = {
            statusCode: statusCodes.INTERNAL_SERVER_ERROR,
            body: error.message
        }
    }

    return {
        statusCode: response.statusCode,
        body: JSON.stringify(response.body)
    };
}