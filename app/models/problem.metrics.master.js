"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const ProblemMetricsMaster = sequelize.define("ProblemMetricsMaster", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING
    },
    goal: {
      type: DataTypes.TEXT
    },
    management: {
      type: DataTypes.TEXT
    },
    frequency: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('problem_metrics_master')
  });
  ProblemMetricsMaster.associate = function (models) {
    ProblemMetricsMaster.hasMany(models.ProblemMetricTargetMaster, {
      foreignKey: {
        name: 'metric_mid',
        allowNull: false
      },
      as: 'master_targets'
    });
    ProblemMetricsMaster.hasMany(models.ProblemMetricActionPlanMaster, {
      foreignKey: {
        name: 'metric_mid',
        allowNull: false
      },
      as: 'master_act_plans'
    });
  };
  return ProblemMetricsMaster;
};
