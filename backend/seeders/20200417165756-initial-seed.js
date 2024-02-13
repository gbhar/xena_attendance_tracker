module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Teachers',
      [
        {
          firstName: 'Jennifer',
          lastName: 'West',
          email: 'jennifer.west@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Mason',
          lastName: 'Grant',
          email: 'mason.grant@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers'
    );

    return queryInterface.bulkInsert(
      'Students',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          lastLate: new Date(),
          latesCount: 1,
          latesAllowed: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          HomeRoomTeacherId: teachers[0][0].id,
        },
        {
          firstName: 'Jane',
          lastName: 'Tudor',
          email: 'jane.tudor@example.com',
          lastLate: null,
          latesCount: 0,
          latesAllowed: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          HomeRoomTeacherId: teachers[0][1].id,
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Teachers', [
      {
        firstName: ['Jennifer', 'Mason'],
      },
    ]);
    return queryInterface.bulkDelete('Students', [
      {
        firstName: ['John', 'Jane'],
      },
    ]);
  },
};
