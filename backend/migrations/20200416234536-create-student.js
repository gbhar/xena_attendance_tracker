module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      lastLate: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: { isDate: true },
        defaultValue: Sequelize.NOW,
      },
      latesCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 0 },
        defaultValue: 0,
      },
      latesAllowed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 0 },
        defaultValue: 5,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      HomeRoomTeacherId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'Teachers',
          key: 'id',
        },
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Students');
  },
};
