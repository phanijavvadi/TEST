'use strict';

import models from '../models';
import errorMessages from '../util/constants/error.messages';

const User = models.User;

/**
 * Find all user in the db
 *
 **/
export function getOrgUserList({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return User.findAndCountAll({
    attributes: {
      exclude: ['createdBy', 'deletedAt', 'password'],
    },
    include: [{
      model: models.UserCategory,
      as: 'userCategory',
      required: true,
      attributes: []
    }, {
      model: models.UserRole,
      as: 'userRoles',
      required: true,
      attributes: [['id', 'userRoleId']],
      include: [{
        model: models.UserType,
        as: 'userType',
        attributes: [['id', 'userTypeId'], ['name', 'userTypeName'], ['value', 'userTypeValue']],

      }, {
        model: models.UserVerification,
        as: 'userVerification',
        attributes: [['id', 'verificationId'], 'regNo', 'verifiedOn']
      }, {
        model: models.Organisation,
        as: 'organisation',
        attributes: ['name', ['id', 'orgId']]
      }],
      where: {
        ...(options.userRoles.where || {})
      }
    }],
    limit: Number(limit),
    offset: Number(offset),
    distinct: true,
    where: {
      '$userCategory.value$': 'ORG_USER',
      ...(options.where || {})
    }
  })
    ;
};

/**
 * Find a user by user id
 * @param userId
 **/
export function findById(id, options = {includeAll: false}) {
  return User.findById(id, {
    attributes: options.attributes || {exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a user by options
 **/
export function findOne(options = {includeAll: false}) {

  return User.findOne({
    attributes: options.attributes || {exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new user
 * @param user object literal containing info about a user
 **/
export function create(user, {transaction = null, ...options} = {}) {
  return User.create(user, {transaction});
};

/**
 * Update a user
 * @param user object literal containing info about a user
 **/
export function update(user, {transaction = null, ...options} = {}) {
  return User.findById(user.id, {
    attributes: {
      exclude: ['password'],
    }
  }).then((p) => {
    if (p) {
      return p.update(user, {transaction});
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
