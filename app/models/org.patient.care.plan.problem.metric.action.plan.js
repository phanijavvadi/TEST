"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientCarePlanProblemMetricActionPlan = sequelize.define("PatientCarePlanProblemMetricActionPlan", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_care_plan_problem_metric_action_plan')
  });
  PatientCarePlanProblemMetricActionPlan.associate = function (models) {


    PatientCarePlanProblemMetricActionPlan.belongsTo(models.ProblemMetricActionPlanMaster, {
      foreignKey: {
        name: 'act_plan_mid',
        allowNull: false
      },
      as: 'act_plan_master'
    });
    PatientCarePlanProblemMetricActionPlan.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: false
      }
    });

    PatientCarePlanProblemMetricActionPlan.hasMany(models.PatientCarePlanProblemMetricActionPlanInput, {
      foreignKey: {
        name: 'act_plan_id',
        allowNull: false
      },
      as: 'inputs'
    });

  };
  return PatientCarePlanProblemMetricActionPlan;
};
