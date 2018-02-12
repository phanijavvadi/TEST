"use strict";

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
    tableName: 'cm_org_patient_care_plan'
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
