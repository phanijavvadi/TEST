"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientPreventiveHealthChecksData = sequelize.define("PatientPreventiveHealthChecksData", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkup_date: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_preventive_health_checks_data')
  });
  PatientPreventiveHealthChecksData.associate = function (models) {
    PatientPreventiveHealthChecksData.belongsTo(models.PatientPreventiveHealthChecks, {
      foreignKey: {
        name: 'hc_id',
        allowNull: false
      },
      as: 'health_check'
    });
    PatientPreventiveHealthChecksData.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: false
      }
    });
  };
  return PatientPreventiveHealthChecksData;
};
