"use strict";
import constants from "../util/constants/constants";

export default function (sequelize, DataTypes) {
  const UserType = sequelize.define("UserType", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    value: {type: DataTypes.STRING, unique: true},
    regNoVerificationRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName: constants.getTableName('user_types'),
    validate: {
      isUnique: function (next) {
        const self = this;
        const where = {name: self.name};

        UserType.find({
          where: where,
          attributes: ['id', 'name']
        })
          .then(function (record) {
            if (record && self.id !== record.id) {
              return next('USER_TYPE_NAME_EXIST');
            }
            return next();
          })
          .catch(function (err) {
            return next(err.message);
          });
      }
    }
  });
  UserType.associate = function (models) {
    UserType.belongsTo(models.UserCategory, {
      foreignKey: {
        name: 'userCategoryId',
        allowNull: false,
      },
      as: 'userCategory'
    });
    UserType.belongsTo(models.UserSubCategory, {
      foreignKey: {
        name: 'userSubCategoryId',
        allowNull: false
      },
      as: 'userSubCategory'
    });
  }


  return UserType;
};
