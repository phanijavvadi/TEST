'use strict';

import models from '../models';

const OrgUserRole = models.OrgUserRole;

/**
 * Find all OrgUserRoles in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return OrgUserRole.findAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};

/**
 * Find a OrgUserRole by OrgUserRole id
 * @param OrgUserRoleId
 **/
export function findById(id, options = {}) {
  return OrgUserRole.findOne({
    attributes: {
      exclude: ['password'],
      include: [...options.include || {}],
    },
    where: {
      id: id
    }
  });
};


/**
 * Create a new OrgUserRole
 * @param data object literal containing info about a OrgUserRole
 **/
export function create(data) {
  return OrgUserRole.create(data);
};

/**
 * Delete OrgUserRole(s) based on input criteria
 * @param orgUserRole object literal containing info about a OrgUserRole
  **/
export function deleteOrgUserRole(orgUserRole) {
  return OrgUserRole.destroy({
    where: {
      ...orgUserRole
    }
  });
};
