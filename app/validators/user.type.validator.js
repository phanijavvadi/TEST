'use strict';
import * as Joi from 'joi';

const validators = {
  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string(),
      name: Joi.string().required(),
      regNoVerificationRequired: Joi.boolean().required(),
      userCategoryId: Joi.string().required(),
      userSubCategoryId: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
      return null;
    }
  },
};
export default validators;
