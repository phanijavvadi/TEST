"use strict";
import constants from "../util/constants/constants";
export default function (sequelize, DataTypes) {
  const Organisation = sequelize.define("Organisation", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    address1: DataTypes.TEXT,
    address2: DataTypes.TEXT,
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
    tableName: constants.getTableName('organisations')
  });
  Organisation.associate = function (models) {
    Organisation.belongsToMany(models.Organisation, {
      through: 'cm_sub_organisations',
      as: 'subOrganisations',
      foreignKey: 'orgId',
      otherKey: 'subOrgId'
    });
    Organisation.belongsTo(models.Attachment, {
      foreignKey: {
        name:'orgLogo',
        allowNull: true,
      }
    });
    Organisation.hasMany(models.OrgSubscription, {
      as: 'subscriptions',
      foreignKey: {
        name:'orgId',
        allowNull: false
      }
    });
    Organisation.hasMany(models.OrgContactDetails, {
      foreignKey: {
        name: 'orgId',
        allowNull: false
      },
      as:'contactDetails'
    });
    Organisation.belongsTo(models.User, {
      foreignKey: {
        name:'createdBy',
        allowNull: true
      }
    });
    Organisation.belongsTo(models.User, {
      foreignKey: {
        name:'approvedBy',
        allowNull: true
      }
    });
  };
  return Organisation;
};
