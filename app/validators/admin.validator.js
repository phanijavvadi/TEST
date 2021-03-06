'use strict';
import * as Joi from 'joi';
import errorMessages from '../util/constants/error.messages';
import constants from '../util/constants/constants';

const validators = {
  loginReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      userName: Joi.string().required().email().label('User Name'),
      password: Joi.string().min(5).required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(400).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      const headersSchema = {
        context: Joi.string().required().valid([constants.userCategoryTypes.CM_USER,constants.userCategoryTypes.ORG_USER])
      };
      let result = Joi.validate(req.headers, headersSchema, {allowUnknown: true});
      if (result && result.error) {
        resp.status(400).send({errors: result.error.details, message: result.error.details[0].message});
      } else {
        next();
      }
    }
  }
}
export default validators;
