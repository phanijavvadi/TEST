"use strict";

export default function (sequelize, DataTypes) {
  const Attachment = sequelize.define("Attachment", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    fileInfo: {
      type:DataTypes.JSON,
      allowNull:false
    },
  }, {
    paranoid: true,
    underscored: false,
  });
  return Attachment;
};
