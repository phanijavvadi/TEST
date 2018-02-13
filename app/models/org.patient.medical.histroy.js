"use strict";
import constants from "../util/constants/constants";
export default function (sequelize, DataTypes) {
  const PatientMedicalHistory = sequelize.define("PatientMedicalHistory", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    patientInternalId: DataTypes.INTEGER,
    day: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    condition: DataTypes.STRING,
    conditionId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    severity: DataTypes.STRING,
    side: DataTypes.STRING,
    acute: DataTypes.STRING,
    summary: DataTypes.STRING,
    fracture: DataTypes.STRING,
    displaced: DataTypes.STRING,
    compound: DataTypes.STRING,
    comminuted: DataTypes.STRING,
    spriral: DataTypes.STRING,
    greenStick: DataTypes.STRING,
    details: DataTypes.TEXT,
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_medical_history')
  });
  PatientMedicalHistory.associate = function (models) {

    PatientMedicalHistory.belongsTo(models.ImportedData, {
      foreignKey: {
        name: 'importedDataId',
        allowNull: true
      },
      as: 'importedData'
    });
    PatientMedicalHistory.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
  };
  return PatientMedicalHistory;
};
