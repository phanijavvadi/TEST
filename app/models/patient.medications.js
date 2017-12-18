"use strict";
export default function (sequelize, DataTypes) {

  const PatientMedication = sequelize.define("PatientMedication", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    patientInternalId: DataTypes.INTEGER,
    scriptDate:DataTypes.DATE,
    productName:DataTypes.STRING,
    productDescription:DataTypes.TEXT,
    dose:DataTypes.STRING,
    frequency:DataTypes.STRING,
    food:DataTypes.STRING,
    otherDetail:DataTypes.TEXT,
    PRN:DataTypes.STRING,
    instructions:DataTypes.STRING,
    route:DataTypes.STRING,
    quantity:DataTypes.STRING,
    productUnit:DataTypes.STRING,
    repeats:DataTypes.STRING,
    repeatInterval:DataTypes.STRING,
    SAHCNo:DataTypes.STRING,
    userId:DataTypes.INTEGER,
    restrictionCode:DataTypes.INTEGER,
    authority:DataTypes.STRING,
    authorityNumber:DataTypes.STRING,
    approvalNumber:DataTypes.STRING,
    allowSubscription:DataTypes.STRING,
    regulation24:DataTypes.STRING,
    provider:DataTypes.STRING,
    SCID:DataTypes.STRING
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_patient_medications'
  });
  PatientMedication.associate = function (models) {

    PatientMedication.belongsTo(models.ImportedData, {
      foreignKey: {
        name: 'importedDataId',
        allowNull: true
      },
      as: 'importedData'
    });
    PatientMedication.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as: 'organisation'
    });
  };
  return PatientMedication;
};
