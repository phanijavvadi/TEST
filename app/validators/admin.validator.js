'use strict';
import * as Joi from 'joi';
import errorMessages from '../../config/error.messages';
import * as adminService from '../services/admin.service';

const validators = {
  createReqValidator: (req, resp, next)=>{
    const body = req.body;
    let schema = {
      userName: Joi.string().min(3).required(),
      password: Joi.string().min(5).required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  uniqueUserNameValidator: (req, resp, next)=>{
    const {userName}=req.body;
    adminService.findByUserName(userName)
    .then((data)=>{
      if(data){
        resp.status(403).send({ success: false, message: errorMessages.ADMIN_USER_NAME_ALREADY_EXIST});
      }else{
        next();
      }
    })
  },
  loginReqValidator: (req, resp, next)=>{
    const body = req.body;
    let schema = {
      userName: Joi.string().min(3).required(),
      password: Joi.string().min(5).required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(400).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  }
}
export default validators;
