"use strict";

export default function (sequelize, DataTypes) {
  const OrgSubscription = sequelize.define("OrgSubscription", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    validUpTo: {type: DataTypes.DATEONLY, comment: 'Validity date upto'},
    price: DataTypes.DECIMAL(10, 2),
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true
  });
  OrgSubscription.associate = function (models) {

    OrgSubscription.belongsTo(models.SubscriptionType, {
      foreignKey: 'subscriptionId',
      allowNull: false
    });
  }
  return OrgSubscription;
};
