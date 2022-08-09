DROP VIEW IF EXISTS leaderboard;

CREATE VIEW leaderboard AS (
  SELECT
    subq.player,
    CASE WHEN matches.player_a = subq.player THEN rankings.rank_a ELSE rank_b END AS score
  FROM (
    -- Last match with a ranking for each player
    SELECT
      players.id AS player,
      MAX(matches.id) AS last_match
    FROM players
    JOIN matches ON matches.player_a = players.id OR matches.player_b = players.id
    JOIN events ON events.id = matches.event
    JOIN rankings ON rankings.match = matches.id
    GROUP BY
      players.id
  ) subq
  JOIN matches ON matches.id = subq.last_match
  JOIN rankings ON rankings.match = matches.id
  ORDER BY subq.player
);
