"use strict";
import constants from "../util/constants/constants";
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
    tableName: constants.getTableName('org_contact_details')
  });
  OrgContactDetails.associate = function (models) {
    OrgContactDetails.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: true
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
