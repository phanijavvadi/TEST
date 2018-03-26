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
      },
      gender: {
        type: DataTypes.SMALLINT,
        defaultValue: null,
        comment: "1=>Female,2=>Male,3=>Others"
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
      tableName: constants.getTableName('preventive_activities_master'),
      validate: {
        isUnique: function (next) {
          const self = this;
          const where = {name: self.name, preventive_act_cat_mid: self.preventive_act_cat_mid}
          if (self.orgId) {
            where.orgId = self.orgId;
          }
          PreventiveActivityMaster.find({
            where: where,
            attributes: ['id', 'name']
          })
            .then(function (record) {
              if (record && self.id !== record.id) {
                return next('ACTIVITY_NAME_EXIST');
              }
              return next();
            })
            .catch(function (err) {
              return next(err.message);
            });
        }
      }
    });
  PreventiveActivityMaster.associate = function (models) {
    PreventiveActivityMaster.hasMany(models.PreventiveActivityMetricMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false,
      },
      as: 'preventive_metrics_master'
    });
    PreventiveActivityMaster.hasMany(models.PreventiveActivityHealthChecksMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false,
      },
      as: 'activity_health_checks'
    });
    PreventiveActivityMaster.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: true
      }
    });
    PreventiveActivityMaster.hasMany(models.PreventiveActivityAgeGroupMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false,
      },
      as: 'age_groups'
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
