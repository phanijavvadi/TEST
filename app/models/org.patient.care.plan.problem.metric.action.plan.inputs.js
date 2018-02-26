"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientCarePlanProblemMetricActionPlanInput = sequelize.define("PatientCarePlanProblemMetricActionPlanInput", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    defVal: {
      type: DataTypes.STRING,
    },
    response: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_care_plan_problem_metric_action_plan_input')
  });
  PatientCarePlanProblemMetricActionPlanInput.associate = function (models) {
    PatientCarePlanProblemMetricActionPlanInput.belongsTo(models.ProblemMetricActionPlanInputMaster, {
      foreignKey: {
        name: 'input_mid',
        allowNull: false
      },
      as: 'input_master'
    });
    PatientCarePlanProblemMetricActionPlanInput.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: false
      }
    });
  };
  return PatientCarePlanProblemMetricActionPlanInput;
};
