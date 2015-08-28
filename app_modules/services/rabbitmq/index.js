'use strict';
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
global.rabbit = require('352-wascally');
var rabbit = global.rabbit;
var logger = global.logger;
var main = require('../../main');

module.exports = {
  init: init
};

function init() {

  var config = {
    connection: {
      user: process.env.AMQP_USER || null,
      pass: process.env.AMQP_PASSWORD || null,
      server: process.env.AMQP_HOST || '127.0.0.1',
      port: process.env.AMQP_PORT || 5672,
      vhost: process.env.AMQP_VHOST || null
    },
    exchanges: [
      {name: 'tnj.' + process.env.NODE_ENV, type: 'topic', persistent: true},
      {name: 'tnj-deadLetter.' + process.env.NODE_ENV, type: 'topic', persistent: true}
    ],
    queues: [
      {
        name: 'tnj.main',
        limit: 100,
        queueLimit: 100000,
        subscribe: true,
        durable: true,
        deadLetterExchange: 'tnj-deadLetter.' + process.env.NODE_ENV,
        deadLetterRoutingKey: 'tnj.main.rejected'
      },
      {
        name: 'tnj.main.rejected',
        subscribe: false,
        messageTtl: 3600000
      }
    ],
    bindings: [
      {
        exchange: 'tnj.' + process.env.NODE_ENV, target: 'tnj.main',
        keys: [
          'tnj.main.get',
          'tnj.main.post',
          'tnj.main.put',
          'tnj.main.destroy'
        ]
      },
      {
        exchange: 'tnj-deadLetter.' + process.env.NODE_ENV, target: 'tnj.main.rejected',
        keys: ['tnj.main.rejected']
      }
    ]
  };

  /*
   ** Initialize queue handlers
   */

  /*
   * This handler is for handling all of the standard GET requests for the main worker
   */

  var getHandler = rabbit.handle('tnj.main.get', function(message) {
    main.get(message);
  });

  var postHandler = rabbit.handle('tnj.main.post', function(message) {
    main.post(message);
  });

  var putHandler = rabbit.handle('tnj.main.put', function(message) {
    main.put(message);
  });

  var destroyHandler = rabbit.handle('tnj.main.destroy', function(message) {
    main.destroy(message);
  });

  /*
   * This handler is for messages that are sent to but not handled by this worker
   */

  var unhandledMessageHandler = rabbit.onUnhandled(function(message) {
    message.body.rejection_reason = 'No handler available for this message';
    message.reply(message.body);
  });

  rabbit.configure(config).done(function() {
    logger.info('Connection to RabbitMQ established');
  });
}