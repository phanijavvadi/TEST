"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientPreventiveHealth = sequelize.define("PatientPreventiveHealth", {
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
    tableName: constants.getTableName('org_patient_preventive_health')
  });
  PatientPreventiveHealth.associate = function (models) {
    PatientPreventiveHealth.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
    PatientPreventiveHealth.belongsTo(models.Patient, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'patient'
    });
    PatientPreventiveHealth.hasMany(models.PatientPreventiveActivities, {
      foreignKey: {
        name: 'ph_id',
        allowNull: false
      },
      as: 'ph_acts'
    });
    PatientPreventiveHealth.hasMany(models.PatientPreventiveHealthChecks, {
      foreignKey: {
        name: 'ph_id',
        allowNull: false
      },
      as: 'ph_health_checks'
    });
    PatientPreventiveHealth.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: true
      },
      as:'createdBy'
    });
  };
  return PatientPreventiveHealth;
};
