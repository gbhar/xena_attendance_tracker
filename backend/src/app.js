require('dotenv').config({ path: '../../.env' });

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');

const pino = require('pino');
const expressPino = require('express-pino-logger');
const pretty = require('pino-pretty');

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty'
    },
  },
  pretty()
);
const expressLogger = expressPino({ logger });

const routes = require('./routes');
const models = require('../models');

const app = express();
const PORT =
  process.env.NODE_ENV === 'test'
    ? process.env.NODE_TEST_PORT || 5001
    : process.env.NODE_PORT || 5000;

app.use(expressLogger);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

const swaggerJSON = yaml.load(fs.readFileSync('public/swagger.yaml'));

app.use(
  '/api/swagger-ui',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSON, { explorer: false })
);

app.use('/api', routes);

models.sequelize.sync().then(() => {
  app.listen(PORT, () =>
    logger.info(
      `Attendance Tracker Server listening at http://localhost:${PORT}`
    )
  );
});

module.exports = app;
