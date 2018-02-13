"use strict";
import constants from "../util/constants/constants";

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
    freezeTableName: true,
    tableName: constants.getTableName('attachments')
  });
  return Attachment;
};
