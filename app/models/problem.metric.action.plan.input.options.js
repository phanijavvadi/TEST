"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const ProblemMetricActionPlanInputOptionMaster = sequelize.define("ProblemMetricActionPlanInputOptionMaster", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
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
    tableName: constants.getTableName('problem_metrics_action_plan_input_options_master')
  });
  ProblemMetricActionPlanInputOptionMaster.associate = function (models) {
  };
  return ProblemMetricActionPlanInputOptionMaster;
};
