module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    'Teacher',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
    },
    {}
  );

  Teacher.associate = (models) => {
    models.Teacher.hasMany(models.Student, { foreignKey: 'HomeRoomTeacherId' });
  };

  return Teacher;
};
