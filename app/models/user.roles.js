"use strict";
export default function (sequelize, DataTypes) {
  const UserRole = sequelize.define("UserRole", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName:'cm_user_roles'
  });
  UserRole.associate = function (models) {
   UserRole.belongsTo(models.User,{
     foreignKey:'userId',
     as:'user',
     allowNull:false
   });

   UserRole.belongsTo(models.Organisation,{
     foreignKey:'orgId',
     as:'organisation',
     allowNull:true,
   });
   UserRole.belongsTo(models.UserCategory,{
     foreignKey:'userCategoryId',
     as:'userCategory',
     allowNull:false
   });
   UserRole.belongsTo(models.UserSubCategory,{
     foreignKey:'userSubCategoryId',
     as:'userSubCategory',
     allowNull:false
   });
   UserRole.belongsTo(models.UserType,{
     foreignKey:'userTypeId',
     as:'userType',
     allowNull:false
   });
  };
  return UserRole;
};
