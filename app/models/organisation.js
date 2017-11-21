"use strict";
export default function (sequelize, DataTypes) {
  const Organisation = sequelize.define("Organisation", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    contPerFname: DataTypes.STRING,
    contPerLname: DataTypes.STRING,
    contPerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contPerAHPRANo: DataTypes.STRING,
    orgName: DataTypes.STRING,
    orgAdd1: DataTypes.TEXT,
    orgAdd2: DataTypes.TEXT,
    phoneNo: DataTypes.STRING,
    fax: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true
  });
  Organisation.associate = function (models) {
    Organisation.belongsTo(models.OrgUserType, {
      foreignKey: {name: 'orgUserTypeId', allowNull: false}
    });
    Organisation.belongsTo(models.Attachment,{
      foreignKey: {name: 'orgLogo', allowNull: true}
    });
    Organisation.hasMany(models.OrgSubscription,{as: 'Subscriptions',foreignKey:'orgId'});
  }
  return Organisation;
};
