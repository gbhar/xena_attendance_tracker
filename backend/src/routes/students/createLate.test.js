const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../../models');
const { httpStatus } = require('../../constants');

const testStudent = {
  firstName: 'Testing',
  lastName: 'Student',
  email: 'testing.student@example.com',
  lastLate: null,
  latesCount: 0,
  latesAllowed: 5,
  HomeRoomTeacherId: 1,
};

const testStudentWithTooManyLates = {
  ...testStudent,
  email: 'late.testing.student@example.com',
  latesCount: testStudent.latesAllowed,
};

describe('createLate Test Suite', () => {
  beforeEach(async () => {
    await db.Student.destroy({
      truncate: true,
    });
    await db.Student.create(testStudent);
    await db.Student.create(testStudentWithTooManyLates);
  });

  it('should return a 200 with the given student successfully marked as late', async () => {
    await request(app)
      .post('/api/students/late')
      .send({ email: 'testing.student@example.com' })
      .set('Content-Type', 'application/json')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.message).to.be.a('string');
        expect(body.message).to.equal(
          `${testStudent.firstName} ${testStudent.lastName} has been successfully been marked as late!`
        );
        expect(body.data.email).to.equal(testStudent.email);
        expect(body.data.latesCount).to.equal(1);
      });
  });

  it('should return a 400 if the given student has been late too many times', async () => {
    await request(app)
      .post('/api/students/late')
      .send({ email: 'late.testing.student@example.com' })
      .set('Content-Type', 'application/json')
      .expect(httpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).to.be.a('string');
        expect(body.error).to.equal(
          `${testStudentWithTooManyLates.firstName} ${testStudentWithTooManyLates.lastName} has been late too many times (more than ${testStudentWithTooManyLates.latesAllowed} allowed lates)!`
        );
      });
  });

  it('should return a 400 if the given student email is not found', async () => {
    await request(app)
      .post('/api/students/late')
      .send({ email: 'bad.email@example.com' })
      .set('Content-Type', 'application/json')
      .expect(httpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).to.be.a('string');
        expect(body.error).to.equal(
          "A student with the email bad.email@example.com doesn't exist!"
        );
      });
  });
});
