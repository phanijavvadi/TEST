"use strict";
export default function (sequelize, DataTypes) {
  const UserCategory = sequelize.define("UserCategory", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    value: {type:DataTypes.STRING,unique:true},
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName:'cm_user_categories'
  });
  UserCategory.associate = function (models) {

  };
  return UserCategory;
};
