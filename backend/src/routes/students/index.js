const students = require('express').Router();

const findOneStudent = require('./findOneStudent');
const findAllStudents = require('./findAllStudents');
const createOneStudent = require('./createOneStudent');
const createLate = require('./createLate');

students.get('/', findAllStudents);

students.get('/:id', findOneStudent);

students.post('/', createOneStudent);

students.post('/late', createLate);

module.exports = students;
