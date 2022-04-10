const playersModels = require('../models/players_models');
const sessionsModels = require('../models/sessions_models');

//create a new session with the host name.
const createNewSession = (req, res) => {
  const { playerName } = req.body;

  playersModels.setPlayerName(playerName)
    .then((playerId) => sessionsModels.setNewSession(playerId))
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send(error.message));
};

//update chosen word in current session
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

//update chosen draw in spesific session, 
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
  sessionsModels.updateWinnerInstances(sessionId)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server internal error');
    });
};

//get draw 
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

//check both words
const checkGuess = (req, res) => {
  const { sessionId, playerId, hostTurn, guessedWord } = req.body;
  sessionsModels.getChosenWord(sessionId)
    .then((correctWord) => {
      //if we have correct word then we will update all the data(update score,switch players turns,reset drew image)
      if (correctWord.toLowerCase() === guessedWord.toLowerCase()) {

        playersModels.getPlayerScore(playerId)
          .then((prevScore) => {

            let currentScore = 0;

            ((fetchedWord) => {

              if (fetchedWord.length < 5)
                currentScore = 1;

              else if (fetchedWord.length >= 5 && fetchedWord.length < 6)
                currentScore = 3;

              else
                currentScore = 5;

            })(guessedWord);
            return prevScore + currentScore;
          })
          .then((currentScore) => playersModels.updatePlayerScore(playerId, currentScore))
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

//geting session information
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

//updating session status
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

//geting top ten scores in all games.
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
