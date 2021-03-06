"use strict";
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {
  const Patient = sequelize.define("Patient", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    surName: DataTypes.STRING,
    patientNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    patientInternalId: {
      type: DataTypes.INTEGER
    },
    dob: {type: DataTypes.DATEONLY},
    gender: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      comment: "1=>Female,2=>Male,3=>Others"
    },
    address1: DataTypes.TEXT,
    address2: DataTypes.TEXT,
    city: DataTypes.TEXT,
    postalAddress: DataTypes.TEXT,
    postalCity: DataTypes.TEXT,
    postalPostcode: DataTypes.TEXT,
    postcode: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    mobileNo: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: DataTypes.STRING,
    registered: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Registered,2=>Not registered"
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_patients'),
    indexes: [{
      unique: true,
      fields: ['patientInternalId', 'orgId']
    }]
  });
  Patient.associate = function (models) {
    Patient.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
    Patient.belongsTo(models.ImportedData, {
      foreignKey: {
        name: 'importedDataId',
        allowNull: true
      },
      as: 'importedData'
    });
    Patient.hasOne(models.PatientHealthInsurance, {
      foreignKey: {
        name: 'patientId',
        allowNull: false
      },
      as: 'healthInsurance'
    });
    Patient.hasOne(models.PatientSocialHistory, {
      foreignKey: {
        name: 'patientId',
        allowNull: false
      },
      as: 'socialHistory'
    });

    Patient.hasMany(models.PatientCarePlan, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'carePlan'
    });
    Patient.hasMany(models.PatientClinicalMetricData, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'clinicalData'
    });
    Patient.hasMany(models.PatientMedicalHistory, {
      foreignKey: {
        name: 'patientId',
        allowNull: false
      },
      as: 'medicalHistory'
    });
    Patient.hasMany(models.PatientFamilyHistory, {
      foreignKey: {
        name: 'patientId',
        allowNull: false
      },
      as: 'familyHistory'
    });
    Patient.hasMany(models.PatientMedication, {
      foreignKey: {
        name: 'patientId',
        allowNull: false
      },
      as: 'medications'
    });
    Patient.hasMany(models.PatientDevice, {
      foreignKey: {
        name: 'patient_id',
        allowNull: false
      },
      as: 'devices'
    });
    Patient.belongsTo(models.Attachment, {
      foreignKey: {
        name: 'profilePic',
        allowNull: true,
      }
    });
  };

  Patient.beforeCreate((user, options) => {
    if (user.password) {
      user.password = commonUtil.getHash(user.password);
    }
  });
  Patient.beforeUpdate((user, options) => {
    if (user.password) {
      user.password = commonUtil.getHash(user.password);
    }
  });
  return Patient;
};
