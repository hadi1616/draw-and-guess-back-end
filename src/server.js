const express = require('express');
const cors = require('cors');
const sessionsControllers = require('./controllers/sessions_handler');
const playersControllers = require('./controllers/players_handler');
const healthCheck = require('./services/healthCheck.service');
const router = express.Router();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


router.post('/sessions/new', sessionsControllers.createNewSession);
router.put('/enter/guest/name', playersControllers.putGuestName);
router.put('/update/chosen/word', sessionsControllers.putCorrectWord);
router.put('/update/drawings', sessionsControllers.putDrawings);
router.put('/update/winner/score', sessionsControllers.putWinnerInstances);
router.post('/get/saved/draw', sessionsControllers.getSavedDraw);
router.post('/guess/attempt', sessionsControllers.checkGuess);
router.post('/session/data', sessionsControllers.getSessionData);
router.put('/update/session/status', sessionsControllers.updateSessionStatus);
router.get('/get/top/ten', sessionsControllers.getTopTenPlayersScore);
router.get('/status', healthCheck);
app.use('/api', router);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


