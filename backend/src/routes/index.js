const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const routes = require('express').Router();

const students = require('./students');
const teachers = require('./teachers');
const processImage = require('./process-image');

routes.post('/process-image', upload.single('student-id'), processImage);

routes.use('/students', students);

routes.use('/teachers', teachers);

module.exports = routes;
