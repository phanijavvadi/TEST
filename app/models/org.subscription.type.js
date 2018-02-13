"use strict";
import constants from "../util/constants/constants";
export default function (sequelize, DataTypes) {
  const SubscriptionType = sequelize.define("SubscriptionType", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    desc: DataTypes.TEXT,
    validity: {type:DataTypes.INTEGER, comment:'Validity in days'},
    price: DataTypes.DECIMAL(10, 2)
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('org_subscription_types')
  });
  SubscriptionType.associate = function (models) {

  };


  return SubscriptionType;
};
