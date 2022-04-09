BEGIN;

DROP TABLE IF EXISTS players, sessions CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;

CREATE TYPE session_status AS ENUM ('pending','live','expired');

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(25) NOT NULL,
  score INTEGER DEFAULT 0
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  -- session_url VARCHAR(10) UNIQUE NOT NULL,
  status session_status DEFAULT 'pending' NOT NULL,
  host_player_id INTEGER REFERENCES players(id) NOT NULL,
  guest_player_id INTEGER REFERENCES players(id),
  host_turn BOOLEAN DEFAULT TRUE NOT NULL,
  correct_word VARCHAR(25),
  draw_data text,
  winner_score INTEGER,
  winner_name VARCHAR(25),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMIT; 