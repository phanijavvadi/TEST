"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const CareProblemMetricActionPlan = sequelize.define("CareProblemMetricActionPlan", {
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
    tableName: constants.getTableName('care_problem_metrics_action_plans')
  });
  CareProblemMetricActionPlan.associate = function (models) {

    CareProblemMetricActionPlan.belongsTo(models.CareProblemMetric, {
      foreignKey: {
        name: 'metricId',
        allowNull: false
      },
      as: 'actionPlan'
    });
    CareProblemMetricActionPlan.hasMany(models.CareProblemMetricActionPlanInput, {
      foreignKey: {
        name: 'actionPlanId',
        allowNull: false
      },
      as: 'actionPlanInputs'
    });

  };
  return CareProblemMetricActionPlan;
};
