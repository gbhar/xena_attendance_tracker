const models = require('../../../models');
const { httpStatus } = require('../../constants');

module.exports = (req, res) => {
  models.Teacher.findAll({
    attributes: ['firstName', 'lastName', 'email'],
    include: [
      {
        model: models.Student,
        as: 'Students',
        attributes: ['firstName', 'lastName', 'email'],
      },
    ],
  })
    .then((teachers) => {
      res.status(httpStatus.OK).json({ data: teachers });
    })
    .catch((err) => {
      req.log.error(err);
      res.status(httpStatus.SERVER_ERROR).json({
        error: 'Something went wrong when querying all the teachers!',
      });
    });
};
