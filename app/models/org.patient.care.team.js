"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {

  const PatientCareTeam = sequelize.define("PatientCareTeam", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    comments: {
      type: DataTypes.TEXT,
    }

  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_care_team')
  });
  PatientCareTeam.associate = function (models) {
    PatientCareTeam.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
    PatientCareTeam.belongsTo(models.Patient, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'patient'
    });

    PatientCareTeam.belongsTo(models.User, {
      foreignKey: {
        name: 'provider_id',
        allowNull: false,
        comment: 'Provider of practitioner or other user'
      },
      as: 'provider'
    });

    PatientCareTeam.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by',
        allowNull: true
      },
      as: 'createdBy'
    });
  };
  return PatientCareTeam;
};
