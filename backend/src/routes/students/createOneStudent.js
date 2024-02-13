const models = require('../../../models');
const { httpStatus } = require('../../constants');

module.exports = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    lastLate = null,
    latesCount = 0,
    latesAllowed = 5,
    homeRoomTeacherEmail,
  } = req.body;

  let homeRoomTeacherId = null;

  if (
    [firstName, lastName, email, homeRoomTeacherEmail].some(
      (element) => element === undefined
    )
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error:
        'When creating a new student, the first name, last name, email, and home room teacher are all required!',
    });
  }

  try {
    const teacher = await models.Teacher.findOne({
      where: {
        email: homeRoomTeacherEmail,
      },
    });

    if (teacher === null) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: `A homeroom teacher with the email ${homeRoomTeacherEmail} was not found!`,
      });
    }

    req.log.debug(`Found a teacher with the email ${homeRoomTeacherEmail}!`);
    homeRoomTeacherId = teacher.id;
  } catch (err) {
    req.log.error(err);
    return res.status(httpStatus.SERVER_ERROR).json({
      error: `Something went wrong when querying a teacher with email ${homeRoomTeacherEmail}!`,
    });
  }

  try {
    let student = await models.Student.findOne({
      where: { email },
    });

    if (student !== null) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'This email is in use already by another student!',
      });
    }

    student = await models.Student.create({
      firstName,
      lastName,
      email,
      lastLate,
      latesCount,
      latesAllowed,
      HomeRoomTeacherId: homeRoomTeacherId,
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
    return res.status(httpStatus.CREATED).json({
      data: student,
      message: `${firstName} ${lastName} has been successfully added to the database!`,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(httpStatus.SERVER_ERROR).json({
      error: 'Something went wrong when creating a student!',
    });
  }
};
