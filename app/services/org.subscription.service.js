'use strict';

import models from '../models';

const OrgSubscription = models.OrgSubscription;

/**
 * Find all OrgSubscriptions in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return OrgSubscription.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};

/**
 * Find all OrgSubscriptions in the db
 *
 **/
export function getOptions() {
  return OrgSubscription.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    }
  });
};

/**
 * Find a OrgSubscription by OrgSubscription id
 * @param id
 **/
export function findById(id, options = {}) {
  return OrgSubscription.findOne({
    attributes: {
      exclude: [...options.exclude || {}],
      include: [...options.include || {}],
    },
    where: {
      id: id,
      ...options.where || {}
    }
  });
};
/**
 * Find a OrgSubscription by OrgSubscription id
 * @param id
 **/
export function findOne(options = {}) {
  return OrgSubscription.findOne({
    attributes: {
      exclude: [...options.exclude || {}],
      include: [...options.include || {}],
    },
    where: {
      ...options.where || {}
    }
  });
};


/**
 * Create a new OrgSubscription
 * @param data object literal containing info about a OrgSubscription
 **/
export function create(data) {
  return OrgSubscription.create(data);
};


/**
 * Update a orgSubscription
 * @param orgSubscription object literal containing info about a orgSubscription
 **/
export function update(orgSubscription) {
  return OrgSubscription.findById(orgSubscription.id, {
    attributes: {
    }
  }).then((p) => {
      if (p) {
        return p.update(orgSubscription);
      } else {
        return new Promise((resolve, reject) => {
          reject({message: errorMessages.INVALID_ORG_SUBSCRIPTION_ID, code: 'INVALID_ORG_SUBSCRIPTION_ID'})
        })
      }

    });
};

/**
 * Delete OrgSubscription(s) based on input criteria
 * @param orgSubscriptionType object literal containing info about a OrgSubscription
 **/
export function deleteOrgSubscription(orgSubscriptionType) {
  return OrgSubscription.destroy({
    where: {
      ...orgSubscriptionType
    }
  });
};
