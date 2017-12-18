'use strict';

export default  {
  contexts:{
    PATIENT:'PATIENT',
  },
  userCategoryTypes: {
    CM_USER: 'CM_USER',
    ORG_USER: 'ORG_USER',
  },
  userSubCategory: {
    CM_ADMIN_USERS:'CM_ADMIN_USERS',
    ORG_ADMIN_USERS:'ORG_ADMIN_USERS',
    ORG_PRACTITIONERS:'ORG_PRACTITIONERS',
  },
  userTypes:{
    SUPER_ADMIN:'SUPER_ADMIN',
    ORG_ADMIN:'ORG_ADMIN',
    ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER:'ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER',
    CHINESE_MEDICINE_PRACTITIONER:'CHINESE_MEDICINE_PRACTITIONER',
    CHIROPRACTOR:'CHIROPRACTOR',
  },
  errorCodes:{
    INVALID_ORG_USER_TYPE:'INVALID_ORG_USER_TYPE',
  }
};
