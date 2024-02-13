const models = require('../../../models');
const { httpStatus } = require('../../constants');

module.exports = (req, res) => {
  models.Student.findOne({
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
    where: {
      id: req.params.id,
    },
  })
    .then((student) => {
      if (student === null) {
        return res.status(httpStatus.BAD_REQUEST).json({
          error: `A student with the ID ${req.params.id} was not found!`,
        });
      }
      return res.status(httpStatus.OK).json({ data: student });
    })
    .catch((err) => {
      req.log.error(err);
      return res.status(httpStatus.SERVER_ERROR).json({
        error: `Something went wrong when querying a student with ID ${req.params.id}!`,
      });
    });
};
