"use strict";
export default function (sequelize, DataTypes) {
  const Organisation = sequelize.define("Organisation", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    suburb: DataTypes.TEXT,
    postcode: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    fax: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName:'cm_organisations'
  });
  Organisation.associate = function (models) {
    Organisation.belongsToMany(models.Organisation, {
      through:'cm_sub_organisations',
      as: 'subOrganisations',
      foreignKey:'orgId',
      otherKey:'subOrgId'
    });
    Organisation.belongsTo(models.Attachment, {
      foreignKey:'orgLogo',
      allowNull: true,
    });
    Organisation.hasMany(models.OrgSubscription, {
      as: 'subscriptions',
      foreignKey:'orgId',
      allowNull: false
    });
    Organisation.belongsTo(models.User, {
      foreignKey:'createdBy',
      allowNull: true
    });
    Organisation.belongsTo(models.User, {
      foreignKey:'approvedBy',
      allowNull: true
    });
  };
  return Organisation;
};
