"use strict";
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {
  const PatientHealthInsurance = sequelize.define("PatientHealthInsurance", {
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
    tableName: constants.getTableName('org_patient_health_insurance')
  });
  PatientHealthInsurance.associate = function (models) {

    PatientHealthInsurance.belongsTo(models.ImportedData, {
      foreignKey: {
        name: 'importedDataId',
        allowNull: true
      },
      as: 'importedData'
    });
    PatientHealthInsurance.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
  }
  return PatientHealthInsurance;
};
