"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientPreventiveActivities = sequelize.define("PatientPreventiveActivities", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_preventive_activities'),
    validate: {
      isUnique: function (next) {
        const self = this;
        PatientPreventiveActivities.find({
          where: {ph_id: self.ph_id, preventive_act_mid: self.preventive_act_mid},
          attributes: ['id', 'ph_id']
        })
          .then(function (record) {
            if (record && self.id !== record.id) {
              return next('PH_ACT_ALREADY_MAPPED');
            }
            return next();
          })
          .catch(function (err) {
            return next(err.message);
          });
      }
    }
  });
  PatientPreventiveActivities.associate = function (models) {
    PatientPreventiveActivities.belongsTo(models.PreventiveActivityMaster, {
      foreignKey: {
        name: 'preventive_act_mid',
        allowNull: false
      },
      as: 'preventive_act_master'
    });
    PatientPreventiveActivities.hasMany(models.PatientPrevetiveActivityMetric, {
      foreignKey: {
        name: 'ph_act_id',
        allowNull: false
      },
      as: 'metrics'
    });

    PatientPreventiveActivities.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: true
      }
    });
  };
  return PatientPreventiveActivities;
};
