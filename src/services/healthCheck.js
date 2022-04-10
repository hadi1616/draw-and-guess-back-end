const convertTime = (sec) => {
  const strSec = sec.toString()
  const numberWOextention = strSec.split(".")

  totalSecond = Number(numberWOextention[0]);
  var h = Math.floor(totalSecond / 3600);
  var m = Math.floor(totalSecond % 3600 / 60);
  var s = Math.floor(totalSecond % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

  return hDisplay + mDisplay + sDisplay

}

const healthCheck = (req, res) => {
  const status = {
    uptime: convertTime(process.uptime()), //process.uptime(): module which is used to get the number of seconds the Node.js process is running
    date: new Date().toLocaleDateString('en-US'
      , {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }),
    status: 'Live',
  };
  res.status(200).send(status);
};

module.exports = healthCheck;
