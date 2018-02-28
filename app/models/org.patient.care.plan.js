"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientCarePlan = sequelize.define("PatientCarePlan", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Active,2=>In Active,3=>Published"
    }

  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_care_plan')
  });
  PatientCarePlan.associate = function (models) {
    PatientCarePlan.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
    PatientCarePlan.hasMany(models.PatientCarePlanProblems, {
      foreignKey: {
        name: 'cp_id',
        allowNull: false
      },
      as: 'cp_problems'
    });
    PatientCarePlan.belongsTo(models.PatientCarePlan, {
      foreignKey: {
        name: 'cloned_from',
        allowNull: true
      }
    });
    PatientCarePlan.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: true
      },
      as:'createdBy'
    });
  };
  return PatientCarePlan;
};
