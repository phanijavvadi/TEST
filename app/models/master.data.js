"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const MasterData = sequelize.define("MasterData", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.STRING
    },
    key: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.SMALLINT
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('master_data')
  });
  MasterData.associate = function (models) {
  };
  return MasterData;
};
