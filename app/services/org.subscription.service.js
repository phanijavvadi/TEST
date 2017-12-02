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
    attributes: options.attributes || {},
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
    attributes: options.attributes || {},
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
export function update(orgSubscription,options={}) {
  return OrgSubscription.findById(orgSubscription.id, {
    where:{...(options.where || {})}
  }).then((p) => {
      if (p) {
        return p.update(orgSubscription);
      } else {
       throw new Error('INVALID_ORG_SUBSCRIPTION_ID');
      }

    });
};
/**
 * Update a orgSubscription
 * @param orgSubscription object literal containing info about a orgSubscription
 **/
export function unSubscribe(orgSubscription,options={}) {
  return OrgSubscription.findOne({
    where:{...options.where}
  }).then((p) => {
      if (p) {
        return p.update(orgSubscription);
      } else {
       throw new Error('INVALID_ORG_SUBSCRIPTION_ID');
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
