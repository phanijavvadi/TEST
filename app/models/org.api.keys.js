"use strict";
export default function (sequelize, DataTypes) {
  const OrgApiKey = sequelize.define("OrgApiKey", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    privateKey: {
      type:DataTypes.TEXT
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_api_keys'
  });
  OrgApiKey.associate = function (models) {
    OrgApiKey.belongsTo(models.Organisation, {
      foreignKey: {
        name: 'orgId',
        allowNull: true
      }
    });
    OrgApiKey.belongsTo(models.User, {
      foreignKey: {
        name:'createdBy',
        allowNull: true
      }
    });
  };
  return OrgApiKey;
};
