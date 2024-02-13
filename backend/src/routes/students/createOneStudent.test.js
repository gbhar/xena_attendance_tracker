const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../../models');
const { httpStatus } = require('../../constants');

const createStudentRequestBody = {
  firstName: 'Testing',
  lastName: 'Student',
  email: 'testing.student@test.com',
  lastLate: null,
  latesCount: 0,
  latesAllowed: 5,
  homeRoomTeacherEmail: 'jennifer.west@example.com',
};

const faultyCreateStudentRequestBody = {
  lastLate: null,
  latesCount: 0,
  latesAllowed: 5,
};

describe('createOneStudent Test Suite', () => {
  beforeEach(async () => {
    await db.Student.destroy({
      truncate: true,
    });
  });

  it('should return a 201 with the student upon successful creation', async () => {
    await request(app)
      .post('/api/students')
      .send(createStudentRequestBody)
      .set('Content-Type', 'application/json')
      .expect(httpStatus.CREATED)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.message).to.be.a('string');
        expect(body.message).to.equal(
          `${createStudentRequestBody.firstName} ${createStudentRequestBody.lastName} has been successfully added to the database!`
        );
        expect(body.data.email).to.equal(createStudentRequestBody.email);
        expect(body.data.HomeRoomTeacher.email).to.equal(
          createStudentRequestBody.homeRoomTeacherEmail
        );
      });
  });

  it('should return a 400 if some student details are missing', async () => {
    await request(app)
      .post('/api/students')
      .send(faultyCreateStudentRequestBody)
      .set('Content-Type', 'application/json')
      .expect(httpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).to.be.a('string');
        expect(body.error).to.equal(
          'When creating a new student, the first name, last name, email, and home room teacher are all required!'
        );
      });
  });

  it('should return a 400 if the given homeroom teacher is not found', async () => {
    await request(app)
      .post('/api/students')
      .send({
        ...createStudentRequestBody,
        homeRoomTeacherEmail: 'a.wrong.email@example.com',
      })
      .set('Content-Type', 'application/json')
      .expect(httpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).to.be.a('string');
        expect(body.error).to.equal(
          'A homeroom teacher with the email a.wrong.email@example.com was not found!'
        );
      });
  });

  it('should return a 400 if a student with the given email already exists', async () => {
    await db.Student.create({
      ...createStudentRequestBody,
      HomeRoomTeacherId: 1,
    });

    await request(app)
      .post('/api/students')
      .send(createStudentRequestBody)
      .set('Content-Type', 'application/json')
      .expect(httpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.error).to.be.a('string');
        expect(body.error).to.equal(
          'This email is in use already by another student!'
        );
      });

    after(async () => {
      await db.Student.destroy({
        truncate: true,
      });
    });
  });
});
