'use strict';

import models from '../models';
import errorMessages from '../../config/error.messages';

const UserVerification = models.UserVerification;

/**
 * Create a new userVerification
 * @param userVerification object literal containing info about a userVerification
 **/
export function create(userVerification, {transaction = null, ...options} = {}) {
  return UserVerification.create(userVerification, {transaction});
};

/**
 * Update a userVerification
 * @param userVerification object literal containing info about a userVerification
 **/
export function update(userVerification, {transaction = null, ...options} = {}) {
  return UserVerification.findById(userVerification.id).then((p) => {
    if (p) {
      return p.update(userVerification, {transaction});
    } else {
      throw new Error('INVALID_VERIFICATION_ID');
    }
  });
};


/**
 * Find a userVerification by userVerification id
 * @param id
 **/
export function findById(id, options={}) {
  return UserVerification.findById(id,{
    attributes: options.attributes || {},
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Delete userVerification(s) based on input criteria
 * @param userVerification object literal containing info about a userVerification
 **/
export function deleteUserVerification(userVerification) {
  return UserVerification.destroy({
    where: {
      ...userVerification
    }
  });
};
