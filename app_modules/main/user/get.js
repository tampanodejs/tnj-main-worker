var config = require('../../config/environment');
var logger = global.logger;
var handler = global.messageHandler;
var _ = require('lodash');
var Users = require('../../models/users');

module.exports = {
  index: index
};

function index(message) {
  logger.debug('GET /users: ' + JSON.stringify(message.body));
  Users.find(message.body.payload.query_params, function(err, users) {
    if (err) {
      handler.error(err, message);
    } else {
      handler.success(users, message);
    }
  });
}