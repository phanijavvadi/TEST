"use strict";
import commonUtil from "../util/common.util";
export default function (sequelize, DataTypes) {
  const OrgUser = sequelize.define("OrgUser", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    AHPRANumber: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isRegNoVerified:{
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true
  });
  OrgUser.associate = function (models) {
    OrgUser.belongsTo(models.OrgUserType, {
      foreignKey: {
        name: 'orgUserTypeId',
        allowNull:false
      }
    })
    OrgUser.belongsTo(models.Organization, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      }
    })
  }

  OrgUser.beforeCreate((orgUser, options) => {
    if(orgUser.password) {
      orgUser.password = commonUtil.getHash(orgUser.password);
    }
  });
  OrgUser.beforeUpdate((orgUser, options) => {
    if(orgUser.password){
      orgUser.password = commonUtil.getHash(orgUser.password);
    }
  });
  return OrgUser;
};
