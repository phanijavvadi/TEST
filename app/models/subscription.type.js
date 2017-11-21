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
    validity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2)
  }, {
    paranoid: true
  });
  SubscriptionType.associate = function (models) {

  }


  return SubscriptionType;
};
