"use strict";
export default function (sequelize, DataTypes) {
  const OrgUserRole = sequelize.define("OrgUserRole", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    desc: DataTypes.TEXT
  }, {
    paranoid: true
  });
  OrgUserRole.associate = function (models) {

  }


  return OrgUserRole;
};
