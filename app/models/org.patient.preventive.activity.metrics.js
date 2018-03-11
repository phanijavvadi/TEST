"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientPrevetiveActivityMetric = sequelize.define("PatientPrevetiveActivityMetric", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.TEXT
    },
    frequency: {
      type: DataTypes.STRING
    },
    frequencyKey: {
      type: DataTypes.STRING
    },
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_preventive_activity_metrics')
  });
  PatientPrevetiveActivityMetric.associate = function (models) {
    PatientPrevetiveActivityMetric.belongsTo(models.PreventiveActivityMetricMaster, {
      foreignKey: {
        name: 'preventive_metric_mid',
        allowNull: false
      },
      as: 'preventive_metric_master'
    });
    PatientPrevetiveActivityMetric.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: false
      }
    });
  };
  return PatientPrevetiveActivityMetric;
};
