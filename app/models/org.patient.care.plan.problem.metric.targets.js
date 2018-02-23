"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientCarePlanProblemMetricTarget = sequelize.define("PatientCarePlanProblemMetricTarget", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    defVal: {
      type: DataTypes.STRING
    },
    operator: {
      type: DataTypes.STRING
    },
    uom: {
      type: DataTypes.STRING
    },
    response: {
      type: DataTypes.STRING
    },
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_care_plan_problem_metric_targets')
  });
  PatientCarePlanProblemMetricTarget.associate = function (models) {
    PatientCarePlanProblemMetricTarget.belongsTo(models.ProblemMetricTargetMaster, {
      foreignKey: {
        name: 'metric_target_mid',
        allowNull: false
      },
      as:'metric_target_master'
    });
    PatientCarePlanProblemMetricTarget.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PatientCarePlanProblemMetricTarget;
};
