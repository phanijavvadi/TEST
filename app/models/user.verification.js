"use strict";
import constants from "../util/constants/constants";
export default function (sequelize, DataTypes) {
  const UserVerification = sequelize.define("UserVerification", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    verifiedOn: {
      type: DataTypes.DATE,
    },
    regNo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('user_verifications')
  });
  UserVerification.associate = function (models) {
    UserVerification.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        as: 'user',
        allowNull: false
      }
    });
    UserVerification.belongsTo(models.User, {
      as: 'verifiedBy',
      foreignKey: {
        name: 'verifiedUserId',
        allowNull: true
      }
    });
  };
  return UserVerification;
};
