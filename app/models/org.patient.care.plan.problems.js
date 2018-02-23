"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientCarePlanProblems = sequelize.define("PatientCarePlanProblems", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    paranoid: false,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_care_plan_problems'),
    indexes: [
      {
        unique: true,
        fields: ['problemId', 'carePlanId']
      }
    ]
  });
  PatientCarePlanProblems.associate = function (models) {
    PatientCarePlanProblems.belongsTo(models.ProblemsMaster, {
      foreignKey: {
        name: 'problemId',
        allowNull: false
      },
      as: 'careProblem'
    });
    PatientCarePlanProblems.hasMany(models.PatientCarePlanProblemMetric, {
      foreignKey: {
        name: 'cp_prob_id',
        allowNull: false
      },
      as: 'metrics'
    });

    PatientCarePlanProblems.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: true
      }
    });
  };
  return PatientCarePlanProblems;
};
