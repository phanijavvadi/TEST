'use strict';

import models from '../models';

const Admin = models.Admin;

/**
 * Find all users in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return Admin.findAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};

/**
 * Find a user by user name
 * @param userName
 **/
export function findById(id, options = {}) {
  return Admin.findOne({
    attributes: {
      exclude: ['password'],
      include: [...options.include || {}],
    },
    where: {
      id: id
    }
  });
};
/**
 * Find a user by user name
 * @param userName
 **/
export function findByUserName(userName, options = {}) {


  return Admin.find({
    attributes: {
      exclude: ['password'],
      include: [...options.include || {}],
    },
    where: {
      userName: userName
    }
  });
};

/**
 * Create a new user
 * @param user object literal containing info about a user
 * - userName {String}
 * - password {String}
 * - status: active vs inactive
 **/
export function create(user) {
  return Admin.create(user);
};

/**
 * Delete user(s) based on input criteria
 * @param user object literal containing info about a user
 * - userName {String}
 * - firstName {String}
 * - lastName {String}
 * - status: active vs inactive
 **/
export function deleteAdmin(user) {
  return Admin.destroy({
    where: {
      ...user
    }
  });
};
