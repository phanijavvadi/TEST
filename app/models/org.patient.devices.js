"use strict";
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {
  const PatientDevice = sequelize.define("PatientDevice", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    registration_id: DataTypes.STRING,
    uuid: DataTypes.STRING,
    model: DataTypes.STRING,
    platform: DataTypes.STRING,
    version: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    serial: DataTypes.STRING,

  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_devices')
  });
  PatientDevice.associate = function (models) {
    PatientDevice.belongsTo(models.Patient, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'patient'
    });
  };
  return PatientDevice;
};
