'use strict';

import models from '../models';
import errorMessages from '../util/constants/error.messages';

const OrgApiKeyModel = models.OrgApiKey;

/**
 * Find all orgApiKey in the db
 *
 **/
export function getOrgOrgApiKeyList({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return OrgApiKeyModel.findAndCountAll({
    attributes: {
      exclude: ['createdBy', 'deletedAt', 'password'],
    },
    include: options.include || [],
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  })
    ;
};

/**
 * Find a orgApiKey by orgApiKey id
 * @param orgApiKeyId
 **/
export function findById(id, options = {}) {
  return OrgApiKeyModel.findById(id, {
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.include || [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a orgApiKey by options
 **/
export function findOne(options = {includeAll: false}) {

  return OrgApiKeyModel.findOne({
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.include || [],
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new orgApiKey
 * @param orgApiKey object literal containing info about a orgApiKey
 **/
export function create(orgApiKey, {transaction = null, ...options} = {}) {
  return OrgApiKeyModel.create(orgApiKey, {transaction});
};

/**
 * Update a orgApiKey
 * @param orgApiKey object literal containing info about a orgApiKey
 **/
export function update(orgApiKey, {transaction = null, ...options} = {}) {
  return OrgApiKeyModel.findById(orgApiKey.id, {
    attributes: {
      exclude: ['password'],
    },
    transaction
  }).then((p) => {
    if (p) {
      return p.update(orgApiKey, {transaction});
    } else {
      throw new Error('INVALID_ORG_API_KEY');
    }
  });
};

/**
 * Delete orgApiKey(s) based on input criteria
 * @param orgApiKey object literal containing info about a orgApiKey
 **/
export function deleteOrgApiKey(apiData,{transaction = null, ...options} = {}) {
  return OrgApiKeyModel.destroy({
    transaction,
    where: {
      ...apiData
    }
  });
};
