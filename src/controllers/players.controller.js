const playerModels = require('../models/players.models');
const sessionModels = require('../models/sessions.models');

//update Guest Name in a game session by sessionID.
const putGuestName = (req, res) => {
  const { enteredName, sessionId } = req.body;
  playerModels.setPlayerName(enteredName)
    .then((guestId) => sessionModels.updateGuestId(sessionId, guestId))
    .then((guestId) => res.status(200).send(guestId))
    .catch((error) => res.status(500).send(error.message));
};

module.exports = { putGuestName };
