const playersModels = require('../models/players.models');
const sessionsModels = require('../models/sessions.models');

//create a new session in DB with the host player name.
const createNewSession = (req, res) => {
  const { playerName } = req.body;

  playersModels.setPlayerName(playerName)
    .then((playerId) => sessionsModels.setNewSession(playerId))
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send(error.message)); //internal server error
};

//update chosen word in spesific session, by sessionID
const putCorrectWord = (req, res) => {
  const { chosenWord, sessionId } = req.body;
  sessionsModels.updateChosenWord(sessionId, chosenWord)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server internal error');
    });
};

//update chosen word in spesific session, by sessionID
const putDrawings = (req, res) => {
  const { drawData, sessionId } = req.body;
  sessionsModels.updateDraw(sessionId, drawData)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server internal error');
    });
};

//update winner name and score when the game session ends.
const putWinnerInstances = (req, res) => {
  const { sessionId } = req.body;
  sessionsModels
    .updateWinnerInstances(sessionId)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server internal error');
    });
};

//get draw data
const getSavedDraw = (req, res) => {
  const { sessionId } = req.body;
  sessionsModels
    .fetchSavedDraw(sessionId)
    .then((drawData) => {
      res.status(200).send(drawData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

//check a guessing attempt.
const checkGuess = (req, res) => {
  const { sessionId, playerId, hostTurn, guessedWord } = req.body;
  sessionsModels.getChosenWord(sessionId)
    .then((correctWord) => {
      //the check ignores case sensitivity.
      if (correctWord.toLowerCase() === guessedWord.toLowerCase()) {
        /*
            if the word is correct then:
              - get previous score.
              - update score.
              - switch players turns.
              - reset drew image.
              - response with ture value
        */
        playersModels.getPlayerScore(playerId)
          .then((prevScore) => {
            let score = 0;
            ((fetchedWord) => {
              const length = fetchedWord.length;
              if (length < 4) {
                score = 1;
              } else if (length >= 4 && length < 7) {
                score = 3;
              } else {
                score = 5;
              }
            })(guessedWord);
            return prevScore + score;
          })
          .then((score) => playersModels.updatePlayerScore(playerId, score))
          .then(() => sessionsModels.updatePlayerTurn(sessionId, hostTurn))
          .then(() => sessionsModels.updateDraw(sessionId, null))
          .then(() => {
            res.status(200).send(true);
          });
      } else {
        res.status(200).send(false);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

//get session info
const getSessionData = (req, res) => {
  const { sessionId } = req.body;
  sessionsModels.fetchSessionInfo(sessionId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

//update session status
const updateSessionStatus = (req, res) => {
  const { status, sessionId } = req.body;
  sessionsModels.fetchSessionStatus(sessionId, status)
    .then(() => {
      if (status === 'expired') {
        sessionsModels.updateWinnerInstances(sessionId);
      }
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

//get top ten scores in all games.
const getTopTenPlayersScore = (req, res) => {

  sessionsModels.fetchTopTenScores()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal server error.');
    });
};

module.exports = {
  createNewSession,
  putCorrectWord,
  putDrawings,
  putWinnerInstances,
  getSavedDraw,
  checkGuess,
  getSessionData,
  getTopTenPlayersScore,
  updateSessionStatus,
};
