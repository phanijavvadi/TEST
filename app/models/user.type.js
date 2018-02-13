"use strict";
import constants from "../util/constants/constants";
export default function (sequelize, DataTypes) {
  const UserType = sequelize.define("UserType", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    value: {type: DataTypes.STRING, unique: true},
    regNoVerificationRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('user_types')
  });
  UserType.associate = function (models) {
    UserType.belongsTo(models.UserCategory, {
      foreignKey: {
        name: 'userCategoryId',
        allowNull: false,
      },
      as: 'userCategory'
    });
    UserType.belongsTo(models.UserSubCategory, {
      foreignKey: {
        name: 'userSubCategoryId',
        allowNull: false
      },
      as: 'userSubCategory'
    });
  }


  return UserType;
};
