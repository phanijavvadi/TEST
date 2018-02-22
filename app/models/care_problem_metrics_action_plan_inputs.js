"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const CareProblemMetricActionPlanInput = sequelize.define("CareProblemMetricActionPlanInput", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    label: {
      type: DataTypes.STRING,
    },
    defVal: {
      type: DataTypes.STRING,
    },
    required: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
      allowNull: false,
      comment: "0=>False,1=>True"
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
    tableName: constants.getTableName('care_problem_metrics_action_plan_inputs')
  });
  CareProblemMetricActionPlanInput.associate = function (models) {

    CareProblemMetricActionPlanInput.belongsTo(models.MasterData, {
      foreignKey: {
        name: 'inputTypeMasterId',
        allowNull: false
      },
      as: 'inputType'
    });
    CareProblemMetricActionPlanInput.belongsTo(models.MasterData, {
      foreignKey: {
        name: 'uomMasterId',
        allowNull: true
      },
      as: 'uom'
    });
    CareProblemMetricActionPlanInput.belongsTo(models.CareProblemMetricActionPlan, {
      foreignKey: {
        name: 'actionPlanId',
        allowNull: false
      },
      as: 'actionPlanInput'
    });
    CareProblemMetricActionPlanInput.hasMany(models.CareProblemMetricActionPlanInputOption, {
      foreignKey: {
        name: 'actionPlanInputId',
        allowNull: false
      },
      as: 'actionPlanInputOptions'
    });

  };
  return CareProblemMetricActionPlanInput;
};
