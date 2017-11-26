"use strict";
export default function (sequelize, DataTypes) {
  const UserVerification = sequelize.define("UserVerification", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    verifiedOn: {
      type: DataTypes.DATEONLY,
    },
    regNo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_user_verifications'
  });
  UserVerification.associate = function (models) {
    UserVerification.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
    UserVerification.belongsTo(models.UserRole, {
      as: 'organisation',
      foreignKey: {
        name: 'userRoleId',
        allowNull: false,
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
