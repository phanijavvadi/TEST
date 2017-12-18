"use strict";
export default function (sequelize, DataTypes) {

  const PatientFamilyHistory = sequelize.define("PatientFamilyHistory", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    patientInternalId: DataTypes.INTEGER,
    relationName: DataTypes.TEXT,
    condition: DataTypes.TEXT,
    diseaseCode: DataTypes.INTEGER,
    Comment: DataTypes.TEXT
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_patient_family_history'
  });
  PatientFamilyHistory.associate = function (models) {

    PatientFamilyHistory.belongsTo(models.ImportedData, {
      foreignKey: {
        name: 'importedDataId',
        allowNull: true
      },
      as: 'importedData'
    });

  }
  return PatientFamilyHistory;
};
