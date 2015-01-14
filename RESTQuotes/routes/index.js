var express = require('express');
var router = express.Router();
var app = require('../app');

var quotes = [{id:0, author:'Audrey Hepburn', text:"Nothing is impossible, the word itself says I'm possible"},{id:1, author:'Walt Disney', text:"You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you."},{id:2, author:'Unknown', text:"Even the greatest was once a begineer. Don't be afraid to take the first step"},{id:3, author:'Neale Donald Walsch', text:"You are afraid to die, and you're afraid to live. What a way to exist."}];
var generatedID = 4;

function findPosition(id){
	var found = false;
	var position = -1;
	for (var i=0; found==false && i<quotes.length; i++) {
		if (quotes[i].id == id) {
			found = true;
			position = i;
			console.log('The element was found in position -> ' + position);
		}
	}	
	if (found == false) {
		return -1;
	}
	return position;
}

//ok
router.get('/', function(req,res) {
    var data = [];
    quotes.forEach(function(element) {
        data.push({author:element.author, text:element.text, url:'http://localhost:3000/quote/'+element.id});
    });
    res.json(data);
});

//ok
router.get('/quote/random', function (req, res) {
    var id = Math.floor(Math.random() * quotes.length);
    var q = quotes[id];
    res.json(q);
});

//ok
router.get('/quote/:id', function (req, res) {
	var foundPosition = findPosition(req.params.id);
    if (foundPosition == -1) {
        res.statusCode = 404;
        return res.send('Error 404. No quote found');
    }
    var q = quotes[foundPosition];
    res.json(q);
});

//ok
//test with curl -H "Content-Type: application/json" -d '{"author":"Sam","text":"Something fancy!"}' http://localhost:3000/quote
router.post('/quote', function (req, res) {
    if (!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('text')) {
        res.statusCode = 400;
        return res.send('Error 400. Post syntax incorrect');
    }
    var newQuote = {
    	id:generatedID,
        author: req.body.author,
        text: req.body.text
    };
    quotes.push(newQuote);
    generatedID++;
    res.json(true);
});

//test with curl -X DELETE http://localhost:3000/quote/i
router.delete('/quote/:id', function (req, res) {
	var foundPosition = findPosition(req.params.id);
    if (foundPosition == -1) {
        res.statusCode = 404;
        return res.send('Error 404. No quote found');
    }
    quotes.splice(foundPosition, 1);
    res.json(true);
});




module.exports = router;
