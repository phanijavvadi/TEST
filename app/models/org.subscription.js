"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {
  const OrgSubscription = sequelize.define("OrgSubscription", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    validUpTo: {type: DataTypes.DATEONLY, comment: 'Validity date upto'},
    validUpFrom: {type: DataTypes.DATEONLY, comment: 'Validity from date'},
    price: DataTypes.DECIMAL(10, 2),
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_subscriptions')
  });
  OrgSubscription.associate = function (models) {

    OrgSubscription.belongsTo(models.SubscriptionType, {
      foreignKey: {
        name: 'subscriptionTypeId',
        allowNull: false
      },
      as: 'subscriptionType'
    });
  }
  return OrgSubscription;
};
