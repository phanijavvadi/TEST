'use strict';
/**
 * Module dependencies.
 */

require('./config/init')();
const logger = require('./app/util/logger');
const config = require('./config/config');
const express = require('./config/express');
// import * as adminService from "./app/services/admin.service";
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
logger.info('start loading models');
// Bootstrap sequelize models
const models = require('./app/models');
const server = express(models.sequelize);

models.sequelize.sync({
  force:false,
  alter: false,
  logging: console.log
}).then(()=>{
    return server.listenAsync(config.port).then(()=>{
        logger.info('Application started on port ', config.port);
    });
})/*.then(()=>{
  const adminService=require("./app/services/admin.service");
  const orgUserRolesService=require("./app/services/organization.user.roles.service");
  return Promise.all([
    adminService.create({userName:'admin',password:'admin'}),
    orgUserRolesService.create({name:'Medical Practitioner'}),
    ]);
})*/.catch((e)=>{
    logger.error('Failed to start the server', e);
});

export default server;
