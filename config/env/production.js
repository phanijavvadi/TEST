'use strict';
import * as dbConfig from "../db.config";
const config = {
	db: dbConfig.production,
  cryptoHmacSecreteKey:'SEACRETKEYDONTCHANGE',// One time secrete key never change once production user exists,
  ENCRYPTION_KEY:'kz64wp3uxvpoh85ayr7ql305f8hhfwve',//Must be 256 bytes (32 characters)
  jsonwebtokenSecrete:'732f17d08213caf280ae3c4092414dbd0dcc62b424d393fccb00406bcb8f642b',
  jsonwebtokenExpiresIn:24*60*60,//in seconds,
  SENDGRID_API_KEY:'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',
  log: {
		//morgan options: 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		//winston config
		transports: {
			file: {
				level: 'debug',
				filename: '../logs/applog.log',
				handleExceptions: true,
				json: false,
				maxsize: 5242880, //5MB
				colorize: false
			}
		}
	},
  mailNotifications:{
    admin:{
      from:"murali.uideveloper@gmail.com",
      name:"Murali Yarra"
    }
  }
};
export default config;
