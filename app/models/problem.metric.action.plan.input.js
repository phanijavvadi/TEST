"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const ProblemMetricActionPlanInputMaster = sequelize.define("ProblemMetricActionPlanInputMaster", {
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
    tableName: constants.getTableName('problem_metrics_action_plan_input_master')
  });
  ProblemMetricActionPlanInputMaster.associate = function (models) {

    ProblemMetricActionPlanInputMaster.belongsTo(models.MasterData, {
      foreignKey: {
        name: 'input_type_mid',
        allowNull: false
      },
      as: 'input_type_master'
    });
    ProblemMetricActionPlanInputMaster.belongsTo(models.MasterData, {
      foreignKey: {
        name: 'uom_mid',
        allowNull: true
      },
      as: 'uom'
    });
    ProblemMetricActionPlanInputMaster.hasMany(models.ProblemMetricActionPlanInputOptionMaster, {
      foreignKey: {
        name: 'input_mid',
        allowNull: false
      },
      as: 'input_options_master'
    });

  };
  return ProblemMetricActionPlanInputMaster;
};
