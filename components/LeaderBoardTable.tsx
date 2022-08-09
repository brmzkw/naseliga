import styles from '../styles/LeaderboardTable.module.css';

import type { ListLeaderboard } from '../db';

type TopPlayersPropsTypes = {
  first: ListLeaderboard[number],
  second: ListLeaderboard[number],
  third: ListLeaderboard[number],
}

function TopPlayers({ first, second, third } : TopPlayersPropsTypes) {
  return (
    <div className={styles.topPlayers}>
      <div className={styles.first}>
        <div className={styles.name}>{first?.player.name || "?"}</div>
        <div className={styles.score}>{first?.score || "?"}</div>
      </div>

      <div className={styles.second}>
        <div className={styles.name}>{second?.player.name || "?"}</div>
        <div className={styles.score}>{second?.score || "?"}</div>
      </div>

      <div className={styles.third}>
        <div className={styles.name}>{third?.player.name || "?"}</div>
        <div className={styles.score}>{third?.score || "?"}</div>
      </div>
    </div>
  );
}

type ScoresTablePropsType = {
  scores: ListLeaderboard,
}

function ScoresTable({ scores } : ScoresTablePropsType) {
  return (
    <div className={styles.scoresTable}>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, idx) =>
            <tr key={entry.player.id}>
              <td>#{idx + 4}</td>
              <td>{entry.player.name}</td>
              <td>{entry.score}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

type LeaderboardTablePropsType = {
  leaderboard: ListLeaderboard,
}

export default function LeaderboardTable({ leaderboard }: LeaderboardTablePropsType) {
  const first = leaderboard.slice(0, 1)?.[0];
  const second = leaderboard.slice(1, 2)?.[0];
  const third = leaderboard.slice(2, 3)?.[0];

  return (
    <div className={styles.container}>
      <TopPlayers first={first} second={second} third={third} />
      <ScoresTable scores={leaderboard.slice(3)} />
    </div>
  );
}
