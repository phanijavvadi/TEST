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
    value: DataTypes.STRING
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_health_problems_master'
  });
  PatientHealthInsurance.associate = function (models) {

  };
  return PatientHealthInsurance;
};
