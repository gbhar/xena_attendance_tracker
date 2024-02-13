const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../../models');
const { httpStatus } = require('../../constants');

const students = [
  {
    firstName: 'Testing',
    lastName: 'Student 1',
    email: 'testing.student1@test.com',
    lastLate: null,
    latesCount: 0,
    latesAllowed: 5,
    HomeRoomTeacherId: 1,
  },
  {
    firstName: 'Testing',
    lastName: 'Student 2',
    email: 'testing.student2@test.com',
    lastLate: null,
    latesCount: 0,
    latesAllowed: 5,
    HomeRoomTeacherId: 2,
  },
];

describe('findAllStudents Test Suite', () => {
  beforeEach(async () => {
    await db.Student.destroy({
      truncate: true,
    });
    await db.Student.bulkCreate(students);
  });

  it('should return a 200 with all the students', async () => {
    await request(app)
      .get('/api/students/')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.data).to.be.an('array');
        expect(body.data).to.have.lengthOf(2);
        expect(body.data[0].email).to.equal(students[0].email);
      });
  });
});
