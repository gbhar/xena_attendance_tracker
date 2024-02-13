const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const { httpStatus } = require('../../constants');

describe('findAllTeachers Test Suite', () => {
  it('should return a 200 with all the teachers', async () => {
    await request(app)
      .get('/api/teachers/')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.data).to.be.an('array');
        expect(body.data).to.have.lengthOf(2);
        // Here, we're testing against the seed data that the testing DB comes initialized with (see /backend/seeders)
        expect(body.data[0].email).to.equal('jennifer.west@example.com');
        expect(body.data[1].email).to.equal('mason.grant@example.com');
      });
  });
});
