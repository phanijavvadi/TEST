"use strict";
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
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
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
    OrgUser.belongsTo(models.OrgUserType, {foreignKey: 'OrgUserTypeId'})
    OrgUser.belongsTo(models.Organization, {foreignKey: 'OrgId'})
  }
  return OrgUser;
};
