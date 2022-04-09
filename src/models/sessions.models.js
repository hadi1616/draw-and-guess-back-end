const db = require('../database/connection');

//create new game session.
const setNewSession = (playerId) =>
  db
    .query(
      `INSERT INTO sessions (host_player_id) VALUES($1) RETURNING id, host_player_id`,
      [playerId]
    )
    .then(({ rows }) => {
      return {
        sessionId: rows[0].id,
        playerId: rows[0].host_player_id,
      };
    });

//update guestID in a session according to it id.
const updateGuestId = (sessionId, guestId) =>
  db
    .query(
      `UPDATE sessions SET guest_player_id = ($1) WHERE sessions.id = ($2) RETURNING guest_player_id`,
      [guestId, sessionId]
    )
    .then(({ rows }) => {
      return { guestId: rows[0].guest_player_id };
    });

//update the chosen word in a session by sessionID
const updateChosenWord = (sessionId, pickedWord) =>
  db.query(`UPDATE sessions SET correct_word = ($1) WHERE sessions.id = ($2)`, [
    pickedWord,
    sessionId,
  ]);

//update drawings in a session by sessionID
const updateDraw = (sessionId, drawData) =>
  db.query(`UPDATE sessions SET draw_data = ($1) WHERE sessions.id = ($2)`, [
    drawData,
    sessionId,
  ]);

//update winner score and name in a game session by sessionID
const updateWinnerInstances = (sessionId) =>
  db
    .query(
      `
      SELECT name, score
      FROM (
      (SELECT name, score
        FROM sessions
        JOIN players ON players.id=sessions.host_player_id
        WHERE sessions.id = ($1))
     UNION
     (SELECT name, score
      FROM sessions
      JOIN players ON players.id=sessions.guest_player_id
      WHERE sessions.id = ($1))
      ) as players_session
      ORDER BY score DESC
      LIMIT 1;
`,
      [sessionId]
    )
    .then(({ rows }) => rows[0])
    .then(({ name, score }) =>
      db.query(
        `UPDATE sessions SET (winner_score, winner_name) = ($1, $2) WHERE sessions.id = ($3)`,
        [score, name, sessionId]
      )
    );

//get the saved draw from a session by sessionID.
const fetchSavedDraw = (sessionId) =>
  db
    .query(`SELECT draw_data FROM sessions WHERE sessions.id = ($1)`, [
      sessionId,
    ])
    .then(({ rows }) => rows[0].draw_data);

//get the chosen word.
const getChosenWord = (sessionId) =>
  db
    .query(`SELECT correct_word FROM sessions WHERE sessions.id = ($1)`, [
      sessionId,
    ])
    .then(({ rows }) => rows[0].correct_word);

//get all session data.
const fetchSessionInfo = (sessionId) =>
  db
    .query(
      `SELECT sessions.id as session_id, status, host_player_id,
         guest_player_id, host_turn, draw_data,
         host.name as host_name, host.score as host_score,
         guest.name as guest_name, guest.score as guest_score 
         FROM sessions 
         JOIN players as host ON host.id = sessions.host_player_id 
         LEFT JOIN players as guest ON guest.id = sessions.guest_player_id 
         WHERE sessions.id = ($1)`,
      [sessionId]
    )
    .then(({ rows }) => rows[0])
    .then((data) => {
      return {
        sessionId: data.session_id,
        status: data.status,
        drawData: data.draw_data,
        hostTurn: data.host_turn,
        hostId: data.host_player_id,
        guestId: data.guest_player_id,
        hostName: data.host_name,
        hostScore: data.host_score,
        guestName: data.guest_name,
        guestScore: data.guest_score,
      };
    });

//update player's turn.
const updatePlayerTurn = (sessionId, state) =>
  db.query(`UPDATE sessions SET host_turn = ($1) WHERE sessions.id = ($2)`, [
    state,
    sessionId,
  ]);

//update session status.
const fetchSessionStatus = (sessionId, sessionStatus) =>
  db.query(`UPDATE sessions SET status = ($1) WHERE sessions.id = ($2)`, [
    sessionStatus,
    sessionId,
  ]);

//get top 10 score.
const fetchTopTenScores = () =>
  db
    .query(
      `SELECT winner_name, winner_score 
    FROM sessions 
    WHERE winner_score > 0 
    ORDER BY winner_score DESC 
    LIMIT 10`
    )
    .then(({ rows }) => rows);

module.exports = {
  setNewSession,
  updateGuestId,
  updateChosenWord,
  updateDraw,
  updateWinnerInstances,
  fetchSavedDraw,
  getChosenWord,
  fetchSessionInfo,
  updatePlayerTurn,
  fetchSessionStatus,
  fetchTopTenScores,
};
