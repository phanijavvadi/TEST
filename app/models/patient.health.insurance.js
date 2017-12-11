"use strict";
import commonUtil from "../util/common.util";

export default function (sequelize, DataTypes) {
  const PatientHealthInsurance = sequelize.define("Patient", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    insuranceNumber: DataTypes.STRING,
    medicareNumber: DataTypes.STRING
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_patients_health_insurance'
  });
  PatientHealthInsurance.associate = function (models) {

  }
  return PatientHealthInsurance;
};
