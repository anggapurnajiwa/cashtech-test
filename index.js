const api = require('./server');
const { transformRequest, transformResponse } = require('hapi-lambda');


exports.handler = async (event) => {
    // // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda API CT!'),
    // };
    // return response;
    const server = await api.init();
  
    const request = transformRequest(event);
    const response = await server.inject(request);
    return transformResponse(response);
};