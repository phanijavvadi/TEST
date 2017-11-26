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
      allowNull:false
    }
  }, {
    paranoid: true,
    freezeTableName: true,
    tableName:'cm_user_verifications'
  });
  UserVerification.associate = function (models) {
   UserVerification.belongsTo(models.User,{
     foreignKey:'userId',
     as:'user',
     allowNull:false
   });
   UserVerification.belongsTo(models.UserRole,{
     foreignKey:'userRoleId',
     as:'organisation',
     allowNull:false,
   });
    UserVerification.belongsTo(models.User,{
      foreignKey:'verifiedUserId',
      as:'verifiedBy',
      allowNull:true
    });
  };
  return UserVerification;
};
