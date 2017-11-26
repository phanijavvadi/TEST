'use strict';

import models from '../models';
import errorMessages from '../../config/error.messages';

const User = models.User;

/*/!**
 * Find all user in the db
 *
 **!/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return User.findAndCountAll({
    attributes: {
      exclude: ['deletedAt', 'password'],
    },
    include: [{
      model: models.UserType,
      required: true,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      },
    }, {
      model: models.Organisation,
      required: true,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      },
    }],
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};*/

/**
 * Find a user by user id
 * @param userId
 **/
export function findById(id, options = {}) {
  return User.findOne({
    attributes: options.attributes || {exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt']},
    where: {
      id: id,
      ...(options.where || {})
    }
  });
};

/**
 * Find a user by options
 **/
export function findOne(options = {}) {

  return User.findOne({
    attributes: options.attributes || {exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt']},
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new user
 * @param user object literal containing info about a user
 **/
export function create(user) {
  return User.create(user);
};

/**
 * Update a user
 * @param user object literal containing info about a user
 **/
export function update(user) {
  return User.findById(user.id, {
    attributes: {
      exclude: ['password'],
    }
  }).then((p) => {
      if (p) {
        return p.update(user);
      } else {
        return new Promise((resolve, reject) => {
          reject({message: errorMessages.INVALID_USER_ID, code: 'INVALID_USER_ID'})
        })
      }
    });
};

/**
 * Delete user(s) based on input criteria
 * @param user object literal containing info about a user
 **/
export function deleteUser(user) {
  return User.destroy({
    where: {
      ...user
    }
  });
};
