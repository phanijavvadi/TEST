'use strict';
import * as dbConfig from "../db.config";
const config = {
	db: dbConfig.development,
  cryptoHmacSecreteKey:'SEACRETKEYDONTCHANGE',// One time secrete key never change once production user exists,
  jsonwebtokenSecrete:'jsonwebtokenSecrete',
  jsonwebtokenExpiresIn:24*60*60,//In seconds
};
export default config;
