"use strict";
export default function (sequelize, DataTypes) {
  const OrgContactDetails = sequelize.define("OrgContactDetails", {
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
    },
    phoneNo: DataTypes.STRING
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_contact_details'
  });
  OrgContactDetails.associate = function (models) {
    OrgContactDetails.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
    OrgContactDetails.belongsTo(models.UserType, {
      foreignKey: {
        name: 'userTypeId',
        allowNull: true
      }
    });
  }
  return OrgContactDetails;
};
