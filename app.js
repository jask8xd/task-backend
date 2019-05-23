var express = require('express');

var mongoose = require('mongoose');
var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/documentSchemas');
var cors = require('cors');

var app = express();
// graphQL
app.use('*', cors());
app.use(
  '/',
  cors(),
  graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true
  })
);
// mongodb connection
mongoose
  .connect('mongodb://localhost/burea-backend', {
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true
  })
  .then(() => console.log('connection successful'))
  .catch(err => console.error(err));

module.exports = app;
