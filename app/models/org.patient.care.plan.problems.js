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
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_care_plan_problems'),
    validate: {
      isUnique: function (next) {
        const self = this;
        PatientCarePlanProblems.find({
          where: {cp_id: self.cp_id, problem_mid: self.problem_mid},
          attributes: ['id', 'cp_id']
        })
          .then(function (record) {
            if (record && self.id !== record.id) {
              return next('CARE_PROBLEM_ALREADY_MAPPED');
            }
            return next();
          })
          .catch(function (err) {
            return next(err.message);
          });
      }
    }
  });
  PatientCarePlanProblems.associate = function (models) {
    PatientCarePlanProblems.belongsTo(models.ProblemsMaster, {
      foreignKey: {
        name: 'problem_mid',
        allowNull: false
      },
      as: 'problem_master'
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
        name: 'created_by',
        allowNull: true
      }
    });
  };
  return PatientCarePlanProblems;
};
