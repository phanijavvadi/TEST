"use strict";
import commonUtil from "../util/common.util";

export default function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: 'cm_users'
  });
  User.associate = function (models) {
    User.belongsTo(models.UserCategory, {
      foreignKey: 'userCategoryId',
      allowNull: false,
      as: 'userCategory'
    });
    User.belongsTo(models.User, {
      foreignKey: 'createdBy',
      allowNull: true,
    });
  }

  User.beforeCreate((user, options) => {
    if (user.password) {
      user.password = commonUtil.getHash(user.password);
    }
  });
  User.beforeUpdate((user, options) => {
    if (user.password) {
      user.password = commonUtil.getHash(user.password);
    }
  });
  return User;
};
