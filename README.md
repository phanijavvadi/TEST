# cm-api
# Author Murali Yarra <murali.uideveloper@gmail.com>
This is a care monitor restful APIs with node, express, sequelize and postgresql.
## frameworks
* ES6 through babel
* node 
* express
* sequelize
* postgresql
* jsonwebtokens

## folder structure

		cm-api/
		+-- .gitignore
		+-- .babelrc
		+-- .editorconfig
		+-- package.json
		+-- server.js
		+-- app
		¦	 +-- controllers
		¦	 ¦   +-- admin.ctrl.js
		¦	 ¦   +-- organisation.ctrl.js
		¦	 +-- models
		¦	 ¦   +-- admin.js
		¦	 ¦   +-- index.js
		¦	 ¦   +-- organisation.js
		¦	 ¦   +-- organization.user.roles.service.js
		¦	 +-- routes
		¦	 ¦   +-- _index.route.js
		¦	 ¦   +-- organisation.route.js
		¦	 +-- services
		¦	 ¦   +-- admin.service.js
		¦	 ¦   +-- organisation.service.js
		¦	 ¦   +-- organization.user.roles.service.js
		¦	 +-- utils
		¦	 ¦   +-- common.util.js
		¦	 ¦   +-- logger.js
		¦	 +-- validators
		¦	     +-- user.jwt.validator.js
		¦	     +-- admin.validator.js
		¦	     +-- organisation.validator.js
		¦	     +-- organization.user.role.validator.js
		+-- config
			 +-- express.js
			 +-- error.messages.js
			 +-- success.messages.js
			 +-- config.js
			 +-- env
			 ¦   +-- all.js
			 ¦   +-- development.js
			 ¦   +-- production.js
			 ¦   +-- test.js

## commands
* start in development mode: **npm run start:dev**
* build the code to es5: **npm run build**
* node_modules/.bin/sequelize db:seed
