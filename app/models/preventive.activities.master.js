"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const PreventiveActivityMaster = sequelize.define("PreventiveActivityMaster", {
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
            PreventiveActivityMaster.find({
              where: {name: value, preventive_act_cat_mid: self.preventive_act_cat_mid},
              attributes: ['id', 'name']
            })
              .then(function (res) {
                if (res && self.id !== res.id) {
                  return next('ACTIVITY_NAME_EXIST');
                }
                return next();
              })
              .catch(function (err) {
                return next(err.message);
              });
          }
        }
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
      tableName: constants.getTableName('preventive_activities_master')
    });
  PreventiveActivityMaster.associate = function (models) {
    PreventiveActivityMaster.hasMany(models.PreventiveActivityMetricMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false,
      },
      as: 'preventive_metrics_master'
    });
    PreventiveActivityMaster.belongsTo(models.PreventiveActivityCategoryMaster, {
      foreignKey: {
        name: 'preventive_act_cat_mid',
        allowNull: false,
      },
      as: 'preventive_act_cat_master'
    });
    PreventiveActivityMaster.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PreventiveActivityMaster;
};
