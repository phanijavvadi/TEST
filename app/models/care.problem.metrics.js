"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const CareProblemMetric = sequelize.define("CareProblemMetric", {
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
    tableName: constants.getTableName('care_problem_metrics')
  });
  CareProblemMetric.associate = function (models) {
    CareProblemMetric.hasMany(models.CareProblemMetricTarget, {
      foreignKey: {
        name: 'metricId',
        allowNull: false
      },
      as: 'targets'
    });
  };
  return CareProblemMetric;
};
