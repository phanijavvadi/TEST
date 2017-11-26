"use strict";
export default function (sequelize, DataTypes) {
  const UserType = sequelize.define("UserType", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    regNoVerificationRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName:'cm_user_types'
  });
  UserType.associate = function (models) {
    UserType.belongsTo(models.UserCategory, {
      foreignKey: 'userCategoryId',
      allowNull:false,
      as:'userCategory'
    });
    UserType.belongsTo(models.UserSubCategory, {
      foreignKey: {
        name: 'userSubCategoryId',
        allowNull:false
      },
      as:'userSubCategory'
    });
  }


  return UserType;
};
