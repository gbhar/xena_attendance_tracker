const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../../models');
const { httpStatus } = require('../../constants');

const testStudent = {
  firstName: 'Testing',
  lastName: 'Student',
  email: 'testing.student@test.com',
  lastLate: null,
  latesCount: 0,
  latesAllowed: 5,
  HomeRoomTeacherId: 1,
};

describe('findOneStudent Test Suite', () => {
  beforeEach(async () => {
    await db.Student.destroy({
      truncate: true,
    });
    await db.Student.create(testStudent);
  });

  it('should return a 200 with the student with the given id', async () => {
    await request(app)
      .get('/api/students/1')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.data.email).to.equal(testStudent.email);
      });
  });

  it('should return a 400 if the given student id is not found', async () => {
    await request(app)
      .get('/api/students/2')
      .expect(httpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).to.be.a('string');
      });
  });
});
