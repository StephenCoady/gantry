'use strict';
let express = require('express');
let routes = require('./server/api/routes');
let bodyParser = require('body-parser');
let app = express();
let morgan = require('morgan');
let path = require('path');
let multer = require('multer');
let Datastore = require('nedb');
let ENVIRONMENT = process.env.ENV;


app.use((req, res, next) => {
  req.start = Date.now();
  next();
});

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(multer({
  dest: path.join(__dirname, '/uploads/')
}).any());

// Swagger API docs.
app.use('/docs', express.static(path.join(__dirname, './server/api/docs')));

// serve up node modules to front end
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));

app.use(express.static(path.join(__dirname, './app')));

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: ('./app')
  });
});

app.use(routes);

app.get('*', (req, res) => {
  res.send('404 page not found!', 404);
});

if (ENVIRONMENT !== 'dev') {
  app.use(morgan('dev'));
}

app.listen(3000, () => {
  console.log('Express server is listening on port 3000');
});

module.exports = app;
