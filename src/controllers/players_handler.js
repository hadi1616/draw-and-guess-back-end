const playerModels = require('../models/players_models');
const sessionModels = require('../models/sessions_models');

//update Guest Name in a game session by sessionID.
const putGuestName = (req, res) => {
  const { enteredName, sessionId } = req.body;
  playerModels.setPlayerName(enteredName)
    .then((guestId) => sessionModels.updateGuestId(sessionId, guestId))
    .then((guestId) => res.status(200).send(guestId))
    .catch((error) => res.status(500).send(error.message));
};

module.exports = { putGuestName };
