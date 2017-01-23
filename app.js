'use strict';
let express = require('express'),
  routes = require('./routes'),
  app = express(),
  path = require('path'),
  ENVIRONMENT = process.env.ENV;


app.use((req, res, next) => {
  req.start = Date.now();
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

/* GET Api index page */
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: ('./public') });
});


app.listen(3000, () => {
  console.log('Express server is listening on port 3000')
});

module.exports = app;
