"use strict";
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
    tableName:'cm_org_subscription_types'
  });
  SubscriptionType.associate = function (models) {

  };


  return SubscriptionType;
};
