"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const ProblemMetricActionPlanMaster = sequelize.define("ProblemMetricActionPlanMaster", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
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
    tableName: constants.getTableName('problem_metrics_action_plan_master')
  });
  ProblemMetricActionPlanMaster.associate = function (models) {
    ProblemMetricActionPlanMaster.hasMany(models.ProblemMetricActionPlanInputMaster, {
      foreignKey: {
        name: 'act_plan_mid',
        allowNull: false
      },
      as: 'inputs_master'
    });

  };
  return ProblemMetricActionPlanMaster;
};
