"use strict";
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {
  const PatientClinicalMetricData = sequelize.define("PatientClinicalMetricData", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    measurement: DataTypes.STRING,
    source: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      comment: "1=>patient,2=>practice"
    },
    metric_type: DataTypes.STRING,
    on_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patient_clinical_metrics_data')
  });
  PatientClinicalMetricData.associate = function (models) {
    PatientClinicalMetricData.belongsTo(models.Patient, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'patient'
    });
  };
  return PatientClinicalMetricData;
};
