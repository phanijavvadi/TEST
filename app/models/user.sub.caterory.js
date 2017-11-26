"use strict";
export default function (sequelize, DataTypes) {
  const UserSubCategory = sequelize.define("UserSubCategory", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    value: {
      type:DataTypes.STRING,
      unique:true
    },
    multipleRolesAllowCount:{
      type:DataTypes.INTEGER,
      comment:'0=>Allow multiple,1=>Allow Only one role'
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName:'cm_user_sub_categories'
  });
  UserSubCategory.associate = function (models) {
    UserSubCategory.belongsTo(models.UserCategory,{
        foreignKey:'userCategoryId',
        allowNull:false,
        as:'userCategory'
    })

  };
  return UserSubCategory;
};
