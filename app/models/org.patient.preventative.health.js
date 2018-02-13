"use strict";
import constants from "../util/constants/constants";
export default function (sequelize, DataTypes) {

  const PreventativeHealth = sequelize.define("PreventativeHealth", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Active,2=>In Active,3=>Published"
    }

  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('w')
  });
  PreventativeHealth.associate = function (models) {
    PreventativeHealth.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
    PreventativeHealth.hasMany(models.PatientCarePlanProblems, {
      foreignKey: {
        name: 'carePlanId',
        allowNull: false
      },
      as: 'carePlanProblems'
    });
    PreventativeHealth.belongsTo(models.User, {
      foreignKey: {
        name:'createdBy',
        allowNull: true
      }
    });
  };
  return PreventativeHealth;
};
