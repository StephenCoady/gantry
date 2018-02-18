'use strict';
const express = require('express');
const routes = require('./server/api/routes');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
const ENVIRONMENT = process.env.ENV;
const cors = require('cors');

app.use(cors());

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

app.use(routes);

app.get('*', (req, res) => {
  res.send('404 page not found!', 404);
});

if (ENVIRONMENT !== 'dev') {
  app.use(morgan('dev'));
}

app.listen(3001, () => {
  console.log('Express server is listening on port 3001');
});

module.exports = app;
