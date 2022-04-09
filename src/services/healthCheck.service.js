const timeFormat = require('../utils/convertSecondToTime');
const healthTemplate = require('../utils/template');

//return an html page with the server status.
const healthCheck = (_, res) => {
  const status = {
    uptime: timeFormat(process.uptime()),
    date: new Date().toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    status: 'Live',
  };
  res.status(200).send(healthTemplate(status));
};

module.exports = healthCheck;
