const api = require('./setup');
const { transformRequest, transformResponse } = require('hapi-lambda');

// cache the server for better peformance
let server;

exports.handler = async event => {

    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda API CT!'),
    // };
    // return response;

    if (!server) {
        server = await api.init();
    }

    const request = transformRequest(event);

    // handle cors here if needed
    request.headers['Access-Control-Allow-Origin'] = '*';
    request.headers['Access-Control-Allow-Credentials'] = true;

    const response = await server.inject(request);

    return transformResponse(response);
};