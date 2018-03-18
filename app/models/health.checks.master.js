"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const HealthChecksMaster = sequelize.define("HealthChecksMaster", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      tableName: constants.getTableName('org_health_checks_master'),
      validate: {
        isUnique: function (next) {
          const self = this;
          const where = {name: self.name}
          if (self.orgId) {
            where.orgId = self.orgId;
          }
          HealthChecksMaster.find({
            where: where,
            attributes: ['id', 'name']
          })
            .then(function (record) {
              if (record && self.id !== record.id) {
                return next('HEALTH_CHECK_NAME_EXIST');
              }
              return next();
            })
            .catch(function (err) {
              return next(err.message);
            });
        }
      }
    });
  HealthChecksMaster.associate = function (models) {
    HealthChecksMaster.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: true
      }
    });
    HealthChecksMaster.belongsTo(models.User, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false
      }
    });
  };
  return HealthChecksMaster;
};
