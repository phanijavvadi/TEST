"use strict";
export default function (sequelize, DataTypes) {
  const PatientMedicalHistory = sequelize.define("PatientMedicalHistory", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    condOrProblem: DataTypes.STRING,
    dateOfDiagnosis: DataTypes.DATEONLY,
    comments: DataTypes.TEXT
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_patients_medical_history'
  });
  PatientMedicalHistory.associate = function (models) {

  }
  return PatientMedicalHistory;
};
