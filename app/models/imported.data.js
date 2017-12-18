"use strict";

export default function (sequelize, DataTypes) {
  const ImportedData = sequelize.define("ImportedData", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    importedData: DataTypes.JSON

  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_org_imported_data'
  });
  ImportedData.associate = function (models) {
    ImportedData.belongsTo(models.OrgApiKey, {
      foreignKey: {
        name: 'orgApiKeyId',
        allowNull: true
      }
    })
  }
  return ImportedData;
};
