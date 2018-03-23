"use strict";
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {
  const PatientNotification = sequelize.define("PatientNotification", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    message: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_notifications')
  });
  PatientNotification.associate = function (models) {
    PatientNotification.belongsTo(models.Patient, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'patient'
    });
    PatientNotification.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: true
      }
    });
  };
  return PatientNotification;
};
