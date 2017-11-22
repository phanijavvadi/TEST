'use strict';

import models from '../models';

const SubscriptionType = models.SubscriptionType;

/**
 * Find all subscriptionTypes in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return SubscriptionType.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};/**
 * Find all subscriptionTypes in the db
 *
 **/
export function getOptions() {
  return SubscriptionType.findAll({
    attributes:{
      exclude:['createdAt', 'updatedAt', 'deletedAt']
    }
  });
};

/**
 * Find a subscriptionType by subscriptionType id
 * @param subscriptionTypeId
 **/
export function findById(id, options = {}) {
  return SubscriptionType.findOne({
    where: {
      id: id,
      ...options.where || {}
    }
  });
};

/**
 * Create a new subscriptionType
 * @param subscriptionType object literal containing info about a subscriptionType
 **/
export function create(subscriptionType) {
  return SubscriptionType.create(subscriptionType);
};

/**
 * Update a subscriptionType
 * @param subscriptionType object literal containing info about a subscriptionType
 **/
export function update(subscriptionType) {
  return SubscriptionType.findById(subscriptionType.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(subscriptionType);
    } else {
      return new Promise((resolve, reject) => {
        reject({message: errorMessages.SUBSCRIPTION_TYPE_NOT_FOUND, code: 'SUBSCRIPTION_TYPE_NOT_FOUND'})
      })
    }

  });
};

/**
 * Delete subscriptionType(s) based on input criteria
 * @param subscriptionType object literal containing info about a subscriptionType
 **/
export function destroy(subscriptionType) {
  return SubscriptionType.destroy({
    where: {
      ...subscriptionType
    }
  });
};
