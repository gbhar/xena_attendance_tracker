const models = require('../../../models');
const { httpStatus } = require('../../constants');

module.exports = (req, res) => {
  models.Student.findAll({
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'lastLate',
      'latesCount',
      'latesAllowed',
    ],
    include: [
      {
        model: models.Teacher,
        as: 'HomeRoomTeacher',
        attributes: ['firstName', 'lastName', 'email'],
      },
    ],
  })
    .then((students) => {
      res.status(httpStatus.OK).json({ data: students });
    })
    .catch((err) => {
      req.log.error(err);
      res.status(httpStatus.SERVER_ERROR).json({
        error: 'Something went wrong when querying all the students!',
      });
    });
};
