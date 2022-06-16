import styles from '../styles/LeaderBoardTable.module.css';
import { LeaderBoardEntry } from '../lib/naseliga';

type TopPlayersPropsTypes = {
  first: LeaderBoardEntry
  second: LeaderBoardEntry
  third: LeaderBoardEntry
}

function TopPlayers({ first, second, third } : TopPlayersPropsTypes) {
  return (
    <div className={styles.topPlayers}>
      <div className={styles.first}>
        <div className={styles.name}>{first?.player || "?"}</div>
        <div className={styles.score}>{first?.score || "?"}</div>
      </div>

      <div className={styles.second}>
        <div className={styles.name}>{second?.player || "?"}</div>
        <div className={styles.score}>{second?.score || "?"}</div>
      </div>

      <div className={styles.third}>
        <div className={styles.name}>{third?.player || "?"}</div>
        <div className={styles.score}>{third?.score || "?"}</div>
      </div>
    </div>
  );
}

type ScoresTablePropsType = {
  scores: LeaderBoardEntry[]
}

function ScoresTable({ scores } : ScoresTablePropsType) {
  return (
    <div className={styles.scoresTable}>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry) =>
            <tr key={entry.player}>
              <td>{entry.player}</td>
              <td>{entry.score}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

type LeaderBoardTablePropsType = {
  leaderboard: LeaderBoardEntry[]
}

export default function LeaderBoardTable({ leaderboard }: LeaderBoardTablePropsType) {
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
