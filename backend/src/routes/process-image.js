const aws = require('aws-sdk');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { getDefaultRoleAssumerWithWebIdentity } = require('@aws-sdk/client-sts');
const fsI = require('fs');
const { promises: fs } = require('fs');
const { createWorker } = require('tesseract.js');
const models = require('../../models');
const { httpStatus } = require('../constants');

const uploadFileS3 = (file, logger) => {
  aws.config.update({
    credentialDefaultProvider: defaultProvider({
      roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(),
    }),
    region: 'us-east-1',
  });
  const s3 = new aws.S3();

  fsI.readFile(file.path, (err, fileBuffer) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      ServerSideEncryption: 'AES256',
      Key: file.originalname,
      Body: fileBuffer,
    };

    s3.upload(params, (perr, pres) => {
      if (perr) {
        logger.error(`Error uploading data: ${perr}`);
      } else {
        logger.info(`File uploaded successfully: ${pres.Location}`);
      }
    });
  });
};

module.exports = async (req, res) => {
  const worker = createWorker({
    logger: (msg) => req.log.debug(msg),
  });

  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    let {
      data: { text },
    } = await worker.recognize(req.file.path);

    text = text.trim();

    req.log.info(
      `Found text from the uploaded file ${req.file.originalname}: ${text}!`
    );

    try {
      const student = await models.Student.findOne({
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
          email: text,
        },
      });

      if (student === null) {
        res.status(httpStatus.BAD_REQUEST).json({
          error: `A student with the email ${text} was not found!`,
        });
      } else {
        res.status(httpStatus.OK).json({ data: student });
      }
    } catch (err) {
      req.log.error(err);
      res.status(httpStatus.SERVER_ERROR).json({
        error: `Something went wrong when querying a student with email ${text}!`,
      });
    }

    // Upload file to S3
    uploadFileS3(req.file, req.log);
    req.log.info(`Uploaded to S3 Bucket: ${process.env.AWS_BUCKET_NAME}`);

    await worker.terminate();
    await fs.unlink(req.file.path);
  } catch (err) {
    req.log.error(err);
    res.status(httpStatus.SERVER_ERROR).json({
      error: 'Something went wrong when parsing the image!',
    });
  }
};
