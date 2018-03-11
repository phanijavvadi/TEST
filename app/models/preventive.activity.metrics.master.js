"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const PreventiveActivityMetricMaster = sequelize.define("PreventiveActivityMetricMaster", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isUnique: function (value, next) {
            const self = this;
            PreventiveActivityMetricMaster.find({
              where: {name: value, preventive_act_mid: self.preventive_act_mid},
              attributes: ['id', 'name']
            })
              .then(function (res) {
                if (res && self.id !== res.id) {
                  return next('METRIC_NAME_EXIST');
                }
                return next();
              })
              .catch(function (err) {
                return next(err.message);
              });
          }
        }
      },
      frequency_master_key: {
        type: DataTypes.STRING
      },
      notes: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        comment: "1=>Active,2=>In Active"
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      tableName: constants.getTableName('preventive_activity_metrics_master')
    });
  PreventiveActivityMetricMaster.associate = function (models) {
    PreventiveActivityMetricMaster.belongsTo(models.PreventiveActivityMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false,
      },
      as: 'preventive_act_master'
    });
    PreventiveActivityMetricMaster.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PreventiveActivityMetricMaster;
};
