'use strict';

import models from '../models';

const UserType = models.UserType;

/**
 * Find all UserTypes in the db
 *
 **/
export function findAll({limit = 50, offset = 0, ...otherOptions} = {}) {
  return UserType.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...otherOptions
    }
  });
};

/**
 * Find all UserTypes in the db
 *
 **/
export function getOrgUserTypeOptions(options={}) {
  return UserType.findAll({
    include: [
      {
        model: models.UserCategory,
        attributes: [],
        require: true,
        where: {
          value: "ORG_USER",
        },
        as: 'userCategory'
      },{
        model: models.UserSubCategory,
        attributes: [],
        require: true,
        as: 'userSubCategory'
      }
    ],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    },
    where:{
      ...(options.where || {})
    }
  });
};

/**
 * Find a UserType by UserType id
 * @param id
 **/
export function findById(id, {includeAssos = false, ...options}) {
  return UserType.findById(id,{
    attributes: options.attributes,
    include: (includeAssos) ? [{
      model: models.UserCategory,
      as: 'userCategory',
      required: true,
    }, {
      model: models.UserSubCategory,
      as: 'userSubCategory',
      required: true,
    }] : [],
    where: {
      ...(options.where || {})
    }
  });
};
