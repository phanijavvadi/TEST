"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const PreventiveActivityMetricsFrequencyMaster = sequelize.define("PreventiveActivityMetricsFrequencyMaster", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.TEXT
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: constants.getTableName('preventive_activity_metrics_frequency_master')
    });
  PreventiveActivityMetricsFrequencyMaster.associate = function (models) {
    PreventiveActivityMetricsFrequencyMaster.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PreventiveActivityMetricsFrequencyMaster;
};
