//Takes the server running up time in seconds and return it HH:MM:SS format.
const modifyTimeFormat = (seconds) => {
  const date = new Date(seconds * 1000);
  return date.toUTCString().split(' ')[4];
};

module.exports = modifyTimeFormat;
