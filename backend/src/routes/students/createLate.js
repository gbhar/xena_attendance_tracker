const models = require('../../../models');
const { httpStatus } = require('../../constants');

module.exports = async (req, res) => {
  const { email, lastLate = null } = req.body;

  try {
    const student = await models.Student.findOne({ where: { email } });

    if (student === null) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `A student with the email ${email} doesn't exist!` });
    }

    if (student.latesCount + 1 > student.latesAllowed) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: `${student.firstName} ${student.lastName} has been late too many times (more than ${student.latesAllowed} allowed lates)!`,
      });
    }

    student = await student.update({
      latesCount: student.latesCount + 1,
      lastLate: lastLate || Date.now(),
    });

    student = await models.Student.findOne({
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
        id: student.id,
      },
    });

    return res.status(httpStatus.OK).json({
      data: student,
      message: `${student.firstName} ${student.lastName} has been successfully been marked as late!`,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(httpStatus.SERVER_ERROR).json({
      error: `Something went wrong when creating a new late report for the student with the email ${email}!`,
    });
  }
};
