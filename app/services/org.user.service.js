'use strict';

import models from '../models';

const OrgUser = models.OrgUser;

/**
 * Find all orgUsers in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return OrgUser.findAll({
    attributes: {
      exclude: ['deletedAt','password'],
      include: [...otherOptions.include || {}],
    },
    include:[{
      model: models.OrgUserType,
      required: true,
      attributes: {
        exclude: ['deletedAt','createdAt','updatedAt']
      },
    }],
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};

/**
 * Find a orgUser by orgUser id
 * @param orgUserId
 **/
export function findById(id, options = {}) {
  return OrgUser.findOne({
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
 * Find a orgUser by orgUser id
 * @param orgUserId
 **/
export function findOne(options = {}) {
  return OrgUser.findOne({
    attributes: {
      exclude: ['password'],
      include: [...options.include || {}],
    },
    where: {
      ...options
    }
  });
};


/**
 * Create a new orgUser
 * @param orgUser object literal containing info about a orgUser
 **/
export function create(orgUser) {
  return OrgUser.create(orgUser);
};

/**
 * Update a orgUser
 * @param orgUser object literal containing info about a orgUser
 **/
export function update(orgUser) {
  return OrgUser.findById(orgUser.id)
    .then((p) => {
      return p.update(orgUser);
    });
};

/**
 * Delete orgUser(s) based on input criteria
 * @param orgUser object literal containing info about a orgUser
 **/
export function deleteOrgUser(orgUser) {
  return OrgUser.destroy({
    where: {
      ...orgUser
    }
  });
};
