"use strict";
export default function (sequelize, DataTypes) {
  const OrgContactDetails = sequelize.define("OrgContactDetails", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    contPerFname: DataTypes.STRING,
    contPerLname: DataTypes.STRING,
    contPerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: DataTypes.STRING
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName:'cm_organisation_contact_details'
  });
  OrgContactDetails.associate = function (models) {
    OrgContactDetails.belongsTo(models.Organisation, {
      foreignKey: {name: 'orgId', allowNull: false}
    });
  }
  return OrgContactDetails;
};
