"use strict";

import * as config from '../../config/config';
import commonUtil from '../util/common.util';


export default function (sequelize, DataTypes) {
  const Admin = sequelize.define("Admin", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      comment: "1=>Active,2=>In Active"
    }
  }, {
    paranoid: true,
    underscored: false,
  });
  Admin.associate = function (models) {

  }

  Admin.beforeCreate((admin, options) => {
    admin.password = commonUtil.getHash(admin.password);
  });
  Admin.beforeUpdate((admin, options) => {
    if(admin.password){
      admin.password = commonUtil.getHash(admin.password);
    }
  });
  return Admin;
};
