'use strict';
import * as dbConfig from "../db.config";
const config = {
	db: dbConfig.development,
  cryptoHmacSecreteKey:'SEACRETKEYDONTCHANGE',// One time secrete key never change once production user exists,
  ENCRYPTION_KEY:'kz64wp3uxvpoh85ayr7ql305f8hhfwve',//Must be 256 bytes (32 characters)
  jsonwebtokenSecrete:'jsonwebtokenSecrete',
  jsonwebtokenExpiresIn:24*60*60,//In seconds,
  SENDGRID_API_KEY:'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',
  mailNotifications:{
	  admin:{
	    from:"support@caremonitor.com.au",
      name:"Caremonitor"
	  }
  }
};
export default config;
