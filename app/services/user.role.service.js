'use strict';

import models from '../models';
import errorMessages from '../util/constants/error.messages';

const UserRole = models.UserRole;

export function getUserRoles(userId, options = {}) {
  return UserRole.findAll({
    attributes: {
      exclude: ['deletedAt', 'createdAt', 'updatedAt'],
    },
    include: [{
      model: models.UserCategory,
      as: 'userCategory',
      required: true,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      }
    }, {
      model: models.UserSubCategory,
      as: 'userSubCategory',
      required: true,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      }
    }, {
      model: models.UserType,
      as: 'userType',
      required: true,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      }
    }],
    where: {
      userId,
      ...(options.where || {})
    }
  });

}

/**
 * Create a new userRole
 * @param userRole object literal containing info about a userRole
 **/
export function bulkCreate(userRoles, {transaction = null, ...options} = {}) {
  return UserRole.bulkCreate(userRoles, {individualHooks: true, transaction});
};

/**
 * Create a new userRole
 * @param userRole object literal containing info about a userRole
 **/
export function create(userRole, {transaction = null, ...options} = {}) {
  return UserRole.create(userRole, {transaction});
};

/**
 * find active practioner user
 * @param orgId
 **/
export function findActivePractitioner(options = {}) {
  return UserRole.findOne({
    attributes: options.attributes || {},
    include: [{
      model: models.UserVerification,
      as: 'userVerification',
      where: {
        verifiedOn: {
          $ne: null
        }
      }
    }],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Update a userRole
 * @param userRole object literal containing info about a userRole
 **/
export function update(userRole, {transaction = null, ...options} = {}) {
  return UserRole.findById(userRole.id).then((p) => {
    if (p) {
      return p.update(userRole, {transaction});
    } else {
      throw new Error(errorMessages.INVALID_USER_ROLE_ID);
    }
  });
};

/**
 * Delete userRole(s) based on input criteria
 * @param userRole object literal containing info about a userRole
 **/
export function deleteUserRole(userRole) {
  return UserRole.destroy({
    where: {
      ...userRole
    }
  });
};
