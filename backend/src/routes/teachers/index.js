const teachers = require('express').Router();

const findAllTeachers = require('./findAllTeachers');

teachers.get('/', findAllTeachers);

module.exports = teachers;
