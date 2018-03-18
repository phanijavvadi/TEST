"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const PreventiveActivityHealthChecksMaster = sequelize.define("PreventiveActivityHealthChecksMaster", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: constants.getTableName('preventive_activity_health_checks_master')
    });
  PreventiveActivityHealthChecksMaster.associate = function (models) {
    PreventiveActivityHealthChecksMaster.belongsTo(models.PreventiveActivityMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false
      }
    });
    PreventiveActivityHealthChecksMaster.belongsTo(models.HealthChecksMaster, {
      foreignKey: {
        name: 'hc_mid',
        allowNull: false
      }
    });
    PreventiveActivityHealthChecksMaster.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PreventiveActivityHealthChecksMaster;
};
