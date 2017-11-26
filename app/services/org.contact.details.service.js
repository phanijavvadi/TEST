'use strict';

import models from '../models';
import errorMessages from '../../config/error.messages';

const OrgContactDetails = models.OrgContactDetails;

/**
 * Find all orgContactDetails in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return OrgContactDetails.findAndCountAll({
    attributes: options.attributes || {exclude: ['deletedAt']},
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a orgContactDetail by orgContactDetail id
 * @param orgContactDetailId
 **/
export function findById(id, options = {}) {
  return OrgContactDetails.findById({
    attributes: options.attributes || {exclude: ['deletedAt', 'createdAt', 'deletedAt']},
    where: {
      id: id,
      ...(options.where || {})
    }
  });
};

/**
 * get a orgContactDetail by options
 * @param options
 **/
export function findOne(options = {}) {
  return OrgContactDetails.findOne({
    attributes: options.attributes || {exclude: ['deletedAt', 'createdAt', 'deletedAt']},
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new orgContactDetail
 * @param orgContactDetail object literal containing info about a orgContactDetail
 **/
export function create(orgContactDetail, {transaction = null, ...otheroptions}) {
  return OrgContactDetails.create(orgContactDetail, {transaction, ...otheroptions});
};

/**
 * Update a orgContactDetail
 * @param orgContactDetail object literal containing info about a orgContactDetail
 **/
export function update(orgContactDetail, {transaction = null, ...otheroptions}) {
  return OrgContactDetails.findById(orgContactDetail.id)
    .then((p) => {
      if (p) {
        return p.update(orgContactDetail, {transaction});
      } else {
        return new Promise((resolve, reject) => {
          reject({message: errorMessages.INVALID_ORG_CONTCT_ID, code: 'INVALID_ORG_CONTCT_ID'})
        });
      }
    });
};

/**
 * Delete orgContactDetail(s) based on input criteria
 * @param orgContactDetail object literal containing info about a orgContactDetail
 **/
export function deleteOrgContactDetails(orgContactDetail) {
  return OrgContactDetails.destroy({
    where: {
      ...orgContactDetail
    }
  });
};
