"use strict";
export default function (sequelize, DataTypes) {
  const OrgUserType= sequelize.define("OrgUserType", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    isRegNoRequired:DataTypes.BOOLEAN
  },{
    paranoid: true
  });
  OrgUserType.associate = function (models) {

  }


  return OrgUserType;
};
