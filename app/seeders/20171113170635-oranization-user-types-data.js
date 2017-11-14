'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('OrgUserTypes', [{
        name:'Aboriginal and Torres Strait Islander Health Practitioner',
        value:'ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER',
        isRegNoRequired:true,
      },{
        name:'Chinese Medicine Practitioner',
        value:'CHINESE_MEDICINE_PRACTITIONER',
        isRegNoRequired:true,
      },{
        name:'Chiropractor',
        value:'Chiropractor',
        isRegNoRequired:true,
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      // return queryInterface.bulkDelete('Person', null, {});
  }
};
