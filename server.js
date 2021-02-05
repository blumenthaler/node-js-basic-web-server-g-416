"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const urlParser = require("url");
const querystring = require("querystring");

const router = new Router({ mergeParams: true });
router.use(bodyParser.json());

let messages = [];
let thisId = 1;
class Message {
  constructor(message) {
    this.id = thisId;
    this.message = message;
    thisId++;
  }
}

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end("Hello, World!");
});

router.post('/message', (request, response) => {
  let msg;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!request.body.message) {
    response.statusCode = 400;
    response.statusMessage = 'No message provided.';
    response.end();
    return;
  }
  msg = new Message(request.body.message);
  messages.push(msg);
  response.end(JSON.stringify(msg.id));
});

router.get('/messages', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(messages));
})

router.get('/message/:id', (request, response) => {
  let url    = urlParser.parse(request.url),
      params = querystring.parse(url.query);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!request.params.id) {
    response.statusCode = 400;
    response.statusMessage = "No message id provided.";
    response.end();
    return;
  }

  let message = messages.find(m => m.id == request.params.id)
  
  if (!message) {
    response.statusCode = 404;
    response.statusMessage = 'Message not found.';
    response.end();
    return;
  }
  response.end(JSON.stringify(message));

});

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
