"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientCarePlanProblemMetric = sequelize.define("PatientCarePlanProblemMetric", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING
    },
    goal: {
      type: DataTypes.TEXT
    },
    management: {
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
    tableName: constants.getTableName('org_patient_care_plan_problem_metrics')
  });
  PatientCarePlanProblemMetric.associate = function (models) {

    PatientCarePlanProblemMetric.belongsTo(models.ProblemMetricsMaster, {
      foreignKey: {
        name: 'metric_mid',
        allowNull: false
      },
      as: 'metric_master'
    });

    PatientCarePlanProblemMetric.hasMany(models.PatientCarePlanProblemMetricTarget, {
      foreignKey: {
        name: 'metric_id',
        allowNull: false
      },
      as: 'targets'
    });
    PatientCarePlanProblemMetric.hasMany(models.PatientCarePlanProblemMetricActionPlan, {
      foreignKey: {
        name: 'metric_id',
        allowNull: false
      },
      as: 'act_plans'
    });
    PatientCarePlanProblemMetric.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PatientCarePlanProblemMetric;
};
