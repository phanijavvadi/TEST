"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const PreventiveActivityAgeGroupMaster = sequelize.define("PreventiveActivityAgeGroupMaster", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      from: {
        type: DataTypes.INTEGER
      },
      to: {
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: constants.getTableName('preventive_activity_age_groups_master')
    });
  PreventiveActivityAgeGroupMaster.associate = function (models) {
    PreventiveActivityAgeGroupMaster.belongsTo(models.PreventiveActivityMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false,
      },
      as: 'preventive_act_master'
    });
    PreventiveActivityAgeGroupMaster.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PreventiveActivityAgeGroupMaster;
};
