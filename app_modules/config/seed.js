/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var config = require('../config/environment');
var Users = require('../models/users');

module.exports = {
  initialize: initialize
};

/**
 * Initializes the collection this worker is in charge of
 * @param {Object} model - The Mongoose model to use for seeding
 */
function initialize(environment) {
  environment = environment.toLowerCase();
  console.log(environment, ' seeding...');
  if (environment === 'dev' || environment === 'development') {
    seedDev();
  } else if (environment === 'staging') {
    seedStaging();
  } else if (environment === 'qa') {
    seedQA();
  }
}

/**
 * Dev
 *
 * Run when in the development environment.
 */
function seedDev() {
  Users.find({}).remove(function() {
    Users.create({
      user_name: 'tnj-admin',
      display_name: 'TNJ Admin',
      last_login: new Date(),
      enabled: true,
      oauth_tokens: []
    }, function () {
      console.log('Successfully seeded users');
    });
  });
}

/**
 * Staging
 *
 * Run when in the staging environment.
 */
function seedStaging() {

}

/**
 * QA
 *
 * Run when in the QA environment.
 */
function seedQA() {

}