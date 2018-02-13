'use strict';

import models from '../models';
import errorMessages from '../util/constants/error.messages';

const Organisation = models.Organisation;

/**
 * Find all organisations in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return Organisation.findAndCountAll({
    attributes: options.attributes || {exclude: ['deletedAt', 'createdAt', 'updatedAt']},
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find all organisations in the db
 *
 **/
export function getOptions(options = {}) {
  return Organisation.findAll({
    attributes: options.attributes || ['name', 'id'],
    include: [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a organisation by organisation id
 * @param organisationId
 **/
export function findById(id, options = {}) {
  return Organisation.findById(id, {
    attributes: options.attributes || {exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'approvedBy']},
    include: options.include || [],
    order: options.order || [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * get a organisation by options
 * @param options
 **/
export function findOne(options = {}) {
  return Organisation.findOne({
    attributes: options.attributes || {exclude: ['password']},
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new organisation
 * @param organisation object literal containing info about a organisation
 **/
export function create(organisation, {transaction = null, ...otheroptions}) {
  return Organisation.create(organisation, {transaction, ...otheroptions});
};

/**
 * Update a organisation
 * @param organisation object literal containing info about a organisation
 **/
export function update(organisation, {transaction = null, ...otheroptions}) {
  return Organisation.findById(organisation.id)
    .then((p) => {
      if (p) {
        return p.update(organisation, {transaction});
      } else {
        throw new Error('INVALID_ORG_ID');
      }
    });
};

/**
 * Delete organisation(s) based on input criteria
 * @param organisation object literal containing info about a organisation
 **/
export function deleteOrganisation(organisation) {
  return Organisation.destroy({
    where: {
      ...organisation
    }
  });
};
