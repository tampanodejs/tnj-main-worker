var config = require('../../config/environment');
var logger = global.logger;
var handler = global.messageHandler;
var _ = require('lodash');
var Users = require('../../models/users');

module.exports = {
  index: index
};

/**
 * GET /tnj/user
 * @param message
 */
function index(message) {
  logger.debug('GET /tnj/user: ' + JSON.stringify(message.body));
  Users.find(message.body.payload.query_params, function(err, users) {
    if (err) {
      handler.error(err, message);
    } else {
      handler.success(users, message);
    }
  });
}