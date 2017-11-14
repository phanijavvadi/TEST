"use strict";
export default function (sequelize, DataTypes) {
  const Organization = sequelize.define("Organization", {
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
    organizationName: DataTypes.STRING,
    organizationAddress: DataTypes.TEXT,
    phoneNumber: DataTypes.STRING,
    fax: DataTypes.STRING,
    AHPRANumber: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true
  });
  Organization.associate = function (models) {
    Organization.belongsTo(models.OrgUserRole, {
      foreignKey: {name: 'orgUserRoleId', allowNull: false}
    })
  }
  return Organization;
};
