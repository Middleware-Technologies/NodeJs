var http = require('http');
var url = require('url');

//create a TODO list

//create array variable for keeping track of the TODOs
var items =[];

var server = http.createServer(function(req, res) {
	switch (req.method) {
	case 'POST':
		req.setEncoding('utf8');		
		var item ='';
		//continue receiving pieces
		req.on('data', function(chunk) {
			item += chunk;
		});
		//put the defined content into the array
		req.on('end', function() {
			items.push(item);
			res.end('OK\n');
		});
		//test with curl -d 'item number 1' http://localhost:3000
		break;
	case 'GET':
		//create a string out of the array
		//map returns an array containing the modified content -> join th array using \n
		var body = items.map(function(item, i) {
			return i + ') ' + item;
		}).join('\n');
		body += '\n';
		res.setHeader('Content-Length', Buffer.byteLength(body));
		res.setHeader('Content-Type', 'text/plain; charset="utf8"');
		res.end(body);
		//test through browser or curl http://localhost:3000
		break;
	case 'DELETE':
		//delete the content from the array -> http://localhost:3000/i
		//prendo il path (escluso host)
		var path = url.parse(req.url).pathname;
		var i = parseInt(path.slice(1),10);
		if (isNaN(i)) {
			res.statusCode = 400;
			res.end('Invalid item id.');
		}
		else if (!items[i]){
			res.statusCode = 404;
			res.end('Item not found');
		}
		else {
			items.splice(i, 1);
			res.end('Ok\n');
		}
		//test with curl -X DELETE http://localhost:3000/i
		break;
	case 'PUT':
		req.setEncoding('utf8');	
		//estrai il numero dell'elemento da modificare
		var item ='';
		var path = url.parse(req.url).pathname;
		var i = parseInt(path.slice(1), 10);
		
		if (isNaN(i)) {
			res.statusCode = 400;
			res.end('Invalid item id.');
		}
		else if (!items[i]){
			res.statusCode = 404;
			res.end('Item not found');
		}
		else {
			req.on('data', function(chunk) {
				item += chunk;
			});
			req.on('end', function() {
				items[i] = item;
				res.end('Ok\n');
			});
		}
		break;
	}

});

server.listen(3000);