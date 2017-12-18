"use strict";
import commonUtil from "../util/common.util";

export default function (sequelize, DataTypes) {
  const PatientSocialHistory = sequelize.define("PatientSocialHistory", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    smokingPerDay: DataTypes.STRING,
    smokingFromDate: DataTypes.DATEONLY,
    drinkingPerWeek:DataTypes.STRING,
    drinkingPerDay:DataTypes.STRING,
    drinkingFreqMoreThanSixPerDay:DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_patients_social_history'
  });
  PatientSocialHistory.associate = function (models) {
    PatientSocialHistory.belongsTo(models.ImportedData, {
      foreignKey: {
        name: 'importedDataId',
        allowNull: true
      },
      as: 'importedData'
    });
  }
  return PatientSocialHistory;
};
