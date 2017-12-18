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
	    from:"murali.uideveloper@gmail.com",
      name:"Murali Yarra"
	  }
  }
};
export default config;
