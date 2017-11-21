"use strict";

export default function (sequelize, DataTypes) {
  const OrgSubscription = sequelize.define("OrgSubscription", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    validUpTo: DataTypes.DATE(6),
    price: DataTypes.DECIMAL(10, 2)
  }, {
    paranoid: true
  });
  OrgSubscription.associate = function (models) {

    OrgSubscription.belongsTo(models.SubscriptionType, {
      foreignKey: 'subscriptionId',
      allowNull: false
    });
   /* OrgSubscription.belongsTo(models.Organisation, {
      foreignKey: 'orgId',
      allowNull: false
    });*/
  }


  return OrgSubscription;
};
