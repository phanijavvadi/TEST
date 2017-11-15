'use strict';

import models from '../models';
import errorMessages from '../../config/error.messages';
const OrgUser = models.OrgUser;

/**
 * Find all orgUsers in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return OrgUser.findAll({
    attributes: {
      exclude: ['deletedAt', 'password'],
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
  return OrgUser.findById(orgUser.id,{
    attributes:{
      exclude: ['password'],
    }
  })
    .then((p) => {
      if (p) {
        return p.update(orgUser);
      } else {
        return new Promise((resolve,reject)=>{
          reject({message:errorMessages.ORG_USER_NOT_FOUND,code:'ORG_USER_NOT_FOUND'})
        })
      }

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
