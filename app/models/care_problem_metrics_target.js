"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const CareProblemMetricTarget = sequelize.define("CareProblemMetricTarget", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    operator: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING
    },
    uom: {
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
    tableName: constants.getTableName('care_problem_metrics_target')
  });
  CareProblemMetricTarget.associate = function (models) {

  };
  return CareProblemMetricTarget;
};
