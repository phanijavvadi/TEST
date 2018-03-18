"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientPreventiveHealthChecks = sequelize.define("PatientPreventiveHealthChecks", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    due_date: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_preventive_health_checks')
  });
  PatientPreventiveHealthChecks.associate = function (models) {
    PatientPreventiveHealthChecks.belongsTo(models.HealthChecksMaster, {
      foreignKey: {
        name: 'hc_mid',
        allowNull: false
      },
      as: 'health_check_master'
    });
    PatientPreventiveHealthChecks.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: false
      }
    });
  };
  return PatientPreventiveHealthChecks;
};
