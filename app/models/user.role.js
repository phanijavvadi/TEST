"use strict";
import constants from "../util/constants/constants";
export default function (sequelize, DataTypes) {
  const UserRole = sequelize.define("UserRole", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('user_roles')
  });
  UserRole.associate = function (models) {

    UserRole.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: true
      },
      as: 'organisation',
    });
    UserRole.belongsTo(models.UserCategory, {
      foreignKey: {
        name: 'userCategoryId',
        allowNull: false
      },
      as: 'userCategory'
    });
    UserRole.hasOne(models.UserVerification, {
      foreignKey: {
        name: 'userRoleId',
        allowNull: false,
      },
      as: 'userVerification',
    });
    UserRole.belongsTo(models.UserSubCategory, {
      foreignKey: {
        name: 'userSubCategoryId',
        allowNull: false
      },
      as: 'userSubCategory'
    });
    UserRole.belongsTo(models.UserType, {
      foreignKey: {
        name: 'userTypeId',
        allowNull: false
      },
      as: 'userType'
    });
  };
  return UserRole;
};
