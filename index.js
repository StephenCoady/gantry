'use strict';
let express = require('express');
let routes = require('./api/routes');
let bodyParser = require('body-parser');
let app = express();
let morgan = require('morgan');
let path = require('path');
var multer = require('multer');
let ENVIRONMENT = process.env.ENV;

app.use((req, res, next) => {
  req.start = Date.now();
  next();
});

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer({
  dest: path.join(__dirname, '/uploads/')
}).any());

app.use(express.static(path.join(__dirname, './app')));
app.use(routes);

if (ENVIRONMENT !== 'dev') {
  app.use(morgan('dev'));
}

// Swagger API docs.
app.use('/docs', express.static(path.join(__dirname, './api/docs')));

// serve up node modules to front end
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));


app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: ('./app')
  });
});

app.get('*', (req, res) => {
  res.send('404 page not found!', 404);
});


app.listen(3000, () => {
  console.log('Express server is listening on port 3000');
});

module.exports = app;
