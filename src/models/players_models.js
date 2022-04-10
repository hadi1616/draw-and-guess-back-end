const db = require('../database/connection');

//enter a new player.
const setPlayerName = (name) =>
  db.query(`INSERT INTO players (name) VALUES($1) RETURNING id`, [name])
    .then(({ rows }) => rows[0].id);

//return the guest name using the session ID.
const getguestPlayerName = (sessionId) =>
  db.query(
    `SELECT players.id, name as guest_name 
    FROM sessions 
    JOIN players ON players.id = sessions.host_guest_id 
    WHERE sessions.id = ${sessionId}`
  )
    .then(({ rows }) => rows[0]);

//update player score using playerID.
const updatePlayerScore = (playerId, score) =>
  db.query(`UPDATE players SET score = ($1) WHERE players.id = ($2)`, [
    score,
    playerId,
  ]);

//return score.
const getPlayerScore = (playerId) =>
  db.query(`SELECT score FROM players WHERE players.id = ($1)`, [playerId])
    .then(({ rows }) => rows[0].score);

module.exports = {
  setPlayerName,
  getguestPlayerName,
  updatePlayerScore,
  getPlayerScore,
};
