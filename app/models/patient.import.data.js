"use strict";

export default function (sequelize, DataTypes) {
  const PatientImportData = sequelize.define("Patient", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    importedData: DataTypes.JSON
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_patient_import_data'
  });
  PatientImportData.associate = function (models) {
  }
  return PatientImportData;
};
