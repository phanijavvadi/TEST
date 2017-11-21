'use strict';

import models from '../models';

const Organisation = models.Organisation;

/**
 * Find all organisations in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return Organisation.findAndCountAll({
    attributes: {
      exclude: ['deletedAt'],
      include: [...otherOptions.include || {}],
    },
    include: [{
      model: models.OrgUserType,
      required: true,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
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
 * get organisation options list
 *
 **/
export function getOptions() {
  return Organisation.findAll({
    attributes: ['id','orgName']
  });
};

/**
 * Find a organisation by organisation id
 * @param organisationId
 **/
export function findById(id, options = {}) {
  let includeTables = [];
  if (options.includeOrgUserType) {
    includeTables.push({
      model: models.OrgUserType,
      attributes: {
        exclude: ['updatedAt', 'createdAt', 'deletedAt']
      }
    });
  }
  return Organisation.findOne({
    attributes: {
      exclude: ['password'],
      include: [...options.include || {}],
    },
    include: includeTables,
    where: {
      id: id
    }
  });
};

/**
 * Find a organisation by organisation id
 * @param organisationId
 **/
export function findOne(options = {}) {
  return Organisation.findOne({
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
 * Create a new organisation
 * @param organisation object literal containing info about a organisation
 **/
export function create(organisation) {
  return Organisation.create(organisation);
};

/**
 * Update a organisation
 * @param organisation object literal containing info about a organisation
 **/
export function update(organisation) {
  return Organisation.findById(organisation.id)
    .then((p) => {
      return p.update(organisation);
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
