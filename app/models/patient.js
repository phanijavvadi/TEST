"use strict";
import commonUtil from "../util/common.util";

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
      comment: "1=>Male,2=>Female,3=>Others"
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
      type:DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Registered,2=>Not registered"
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_patients',
    indexes:[{
      unique:true,
      fields:['patientInternalId','orgId']
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
  }

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
