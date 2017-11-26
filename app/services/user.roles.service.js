'use strict';

import models from '../models';
import errorMessages from '../../config/error.messages';

const UserRole = models.UserRole;

/**
 * Find all userRole in the db
 *
 **/
export function getUserRoles(userId, options = {}) {
  return UserRole.findAll({
    attributes: options.attributes || {exclude: ['deletedAt']},
    include: [{
      model: models.UserType,
      as:'userType',
      required: true,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      },
    }, {
      model: models.UserSubCategory,
      required: true,
      as:'userSubCategory',
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      },
    }, {
      model: models.UserCategory,
      required: true,
      as:'userCategory',
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
      },
    }],
    where: {
      userId,
      ...(options.where || {})
    }
  });
};

/**
 * Find a userRoleRole by options
 **/
export function findOne(options = {}) {

  return UserRole.findOne({
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new userRoleRole
 * @param userRoleRole object literal containing info about a userRoleRole
 **/
export function create(userRoleRole) {
  return UserRole.create(userRoleRole);
};

/**
 * Delete userRoleRole(s) based on input criteria
 * @param userRoleRole object literal containing info about a userRoleRole
 **/
export function deleteUserRole(userRoleRole) {
  return UserRole.destroy({
    where: {
      ...userRoleRole
    }
  });
};
