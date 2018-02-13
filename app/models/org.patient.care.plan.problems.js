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
        fields: ['careProblemId', 'carePlanId']
      }
    ]
  });
  PatientCarePlanProblems.associate = function (models) {
    PatientCarePlanProblems.belongsTo(models.CareProblems, {
      foreignKey: {
        name: 'careProblemId',
        allowNull: true
      },
      as: 'careProblem'
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
