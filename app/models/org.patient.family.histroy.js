"use strict";
import constants from "../util/constants/constants";
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
    comment: DataTypes.TEXT
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_family_history')
  });
  PatientFamilyHistory.associate = function (models) {
    PatientFamilyHistory.belongsTo(models.ImportedData, {
      foreignKey: {
        name: 'importedDataId',
        allowNull: true
      },
      as: 'importedData'
    });
    PatientFamilyHistory.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });

  }
  return PatientFamilyHistory;
};
