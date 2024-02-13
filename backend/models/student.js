module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
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
      lastLate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: { isDate: true },
        defaultValue: DataTypes.NOW,
      },
      latesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
        defaultValue: 0,
      },
      latesAllowed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
        defaultValue: 5,
      },
    },
    {
      validate: {
        latesCountCheck() {
          if (this.latesCount > this.latesAllowed) {
            throw new Error('This student has been late too many times!');
          }
        },
      },
    }
  );

  Student.associate = (models) => {
    models.Student.belongsTo(models.Teacher, {
      as: 'HomeRoomTeacher',
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Student;
};
