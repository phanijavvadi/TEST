"use strict";
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

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
    tableName: constants.getTableName('org_health_problems_master')
  });
  PatientHealthInsurance.associate = function (models) {

  };
  return PatientHealthInsurance;
};
