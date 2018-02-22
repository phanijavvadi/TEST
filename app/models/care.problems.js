"use strict";
import constants from '../util/constants/constants';

export default function (sequelize, DataTypes) {
  const CareProblems = sequelize.define("CareProblems", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    problem: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
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
    tableName: constants.getTableName('care_problems')
  });
  CareProblems.associate = function (models) {
  };
  return CareProblems;
};
