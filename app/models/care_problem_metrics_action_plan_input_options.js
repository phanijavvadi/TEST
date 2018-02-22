"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const CareProblemMetricActionPlanInputOption = sequelize.define("CareProblemMetricActionPlanInputOption", {
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
    tableName: constants.getTableName('care_problem_metrics_action_plan_input_options')
  });
  CareProblemMetricActionPlanInputOption.associate = function (models) {
    CareProblemMetricActionPlanInputOption.belongsTo(models.CareProblemMetricActionPlanInput, {
      foreignKey: {
        name: 'actionPlanInputId',
        allowNull: false
      },
      as: 'actionPlanInputOption'
    });
  };
  return CareProblemMetricActionPlanInputOption;
};
