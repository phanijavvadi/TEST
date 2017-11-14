'use strict';

import models from '../models';

const OrgUserType = models.OrgUserType;

/**
 * Find all OrgUserTypes in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return OrgUserType.findAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};

/**
 * Find a OrgUserType by OrgUserType id
 * @param id
 **/
export function findById(id, options = {}) {
  return OrgUserType.findOne({
    attributes: {
      exclude: [...options.exclude || {}],
      include: [...options.include || {}],
    },
    where: {
      id: id
    }
  });
};


/**
 * Create a new OrgUserType
 * @param data object literal containing info about a OrgUserType
 **/
export function create(data) {
  return OrgUserType.create(data);
};

/**
 * Delete OrgUserType(s) based on input criteria
 * @param orgUserType object literal containing info about a OrgUserType
  **/
export function deleteOrgUserType(orgUserType) {
  return OrgUserType.destroy({
    where: {
      ...orgUserType
    }
  });
};
