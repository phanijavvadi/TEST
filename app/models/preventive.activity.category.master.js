"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const PreventiveActivityCategoryMaster = sequelize.define("PreventiveActivityCategoryMaster", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUnique: function (value, next) {
            const self = this;
            PreventiveActivityCategoryMaster.find({
              where: {name: value},
              attributes: ['id', 'name']
            })
              .then(function (res) {
                if (res && self.id !== res.id) {
                  return next('ACTIVITY_CATEGORY_NAME_EXIST');
                }
                return next();
              })
              .catch(function (err) {
                return next(err.message);
              });
          }
        }
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
      tableName: constants.getTableName('preventive_activity_category_master')
    });
  PreventiveActivityCategoryMaster.associate = function (models) {
    PreventiveActivityCategoryMaster.hasMany(models.PreventiveActivityMaster, {
      foreignKey: {
        name: 'preventive_act_cat_mid',
        allowNull: false
      },
      as: 'activities'
    });
    PreventiveActivityCategoryMaster.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: true
      }
    });
    PreventiveActivityCategoryMaster.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return PreventiveActivityCategoryMaster;
};
