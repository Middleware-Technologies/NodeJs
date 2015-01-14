/**
 * Created by Luca on 08/01/2015.
 */

var http = require('http');
http.createServer(function(request, response)
{
    response.writeHead(200);
    response.write("Hello, this is dog.");
    response.end();
}).listen(8080);
console.log('Listening on port 8080...');
