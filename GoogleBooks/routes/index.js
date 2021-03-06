var express = require('express');
var https = require('https');
var http = require('http');
var querystring = require('querystring');
var router = express.Router();


var partialQueryBook = "/books/v1/volumes?maxResults=30&";
var hostBook = 'www.googleapis.com';
var pathBook = '';
var queryTermBook="";
var startIndex = 0;
var htmlBook = '';


function httpGetBook(response)
{
      var fullRequestQueryBook = partialQueryBook+queryTermBook+"&startIndex="+startIndex;
	  
      console.log('Calling -> ' + fullRequestQueryBook);

	  var headersBook = {
		  'Content-Type': 'application/json'
	  };
	  

	  var optionsBook = {
	    hostname: hostBook,
	    path: fullRequestQueryBook,
	    method: 'GET',
		headers: headersBook
	  };

	  var jsonStringResponseBook = '';

	  var req = https.request(optionsBook, function(res) {
	    console.log("statusCode: ", res.statusCode);
	    console.log("headers: ", res.headers);

	    res.on('data', function(piece) {
	      jsonStringResponseBook += piece;
		  console.log(jsonStringResponseBook);
	    });
		
  	  	res.on('end', function() {
			var content = JSON.parse(jsonStringResponseBook);
			console.log('Found -> ' + content.totalItems);
			htmlBook ='';
			htmlBook += '<h1>Book Search</h1>';
			htmlBook += '<h3>Found -> ' + content.totalItems + '</h3>';
			htmlBook += '<h3>Showing -> ' + content.items.length + '</h3>';
			htmlBook += '<ul>';
			for (var i=0; i<content.items.length; i++) {
				htmlBook += '<li>'+content.items[i].volumeInfo.title+'</li>';
			}
			htmlBook += '</ul>';
			console.log(htmlBook);
			response.send(htmlBook);
  	  	});
		
	  });
	  
	  req.end();
	  
	  req.on('error', function(e) {
	    console.error(e);
	  });
	  
	  
	  
}

var partialQueryMovie = '/api/public/v1.0/movies.json?apikey=';
var hostMovie = 'api.rottentomatoes.com';
var pathMovie = '';
var apiKeyMovie = 'vtbgg3vj4g2cajr672uasjhb';
var queryTermMovie="";
var startIndex = 0;
var htmlMovie = '';

function httpGetMovie(response) {
  var fullRequestQueryMovie = partialQueryMovie + apiKeyMovie + '&' + queryTermMovie + '&page_limit=2';
  console.log('Calling -> ' + fullRequestQueryMovie);

  var headersMovie = {
	  'Content-Type': 'application/json'
  };
  

  var optionsMovie = {
    host: hostMovie,
    path: fullRequestQueryMovie,
    method: 'GET',
	headers: headersMovie
  };

  var jsonStringResponseMovie = '';

  var req = http.request(optionsMovie, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(piece) {
      jsonStringResponseMovie += piece;
	  console.log(jsonStringResponseMovie);
    });
	
	  	res.on('end', function() {
		var content = JSON.parse(jsonStringResponseMovie);
		htmlMovie ='';
		htmlMovie += '<h1>Movie Search</h1>';
		htmlMovie += '<h3>Movies found -> ' + content.total + '</h3>';
		htmlMovie += '<h3>Showing -> 2</h3>';
		htmlMovie += '<ul>';
		for (var i=0; i<2; i++) {
			htmlMovie += '<li>'+content.movies[i].title+'</li>';
		}
		htmlMovie += '</ul>';
		response.send(htmlMovie);
	  	});
	
  });
  
  req.end();
  
  req.on('error', function(e) {
    console.error(e);
  });
	
	
};




/* GET home page. */
router.get('/', function(req, res)
{
  res.send('hi there!!!!!!')
});

router.get('/books', function(req,res) {
	console.log('Received request parameter-> ' + req.query.term);
	queryTermBook = querystring.stringify({q:req.query.term});
	console.log('stringify-> '  + queryTermBook);
	httpGetBook(res);
});

router.get('/movies', function(req,res) {
	console.log('Received request -> ' + req.query.term);
	queryTermMovie = querystring.stringify({q:req.query.term});
	console.log('stringify-> ' + queryTermMovie);
	httpGetMovie(res);
});

module.exports = router;
