import styles from '../styles/LeaderBoardTable.module.css';
import { LeaderBoardEntry } from '../lib/naseliga';

type PropsType = {
  leaderboard: LeaderBoardEntry[]
}

export default function LeaderBoardTable({ leaderboard }: PropsType) {
  return (
    <div className={styles.container}>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, idx) =>
            <tr key={entry.player}>
              <td>
                {idx == 0 ? "🥇" :
                 idx == 1 ? "🥈" :
                 idx == 2 ? "🥉" :
                 `#${idx + 1}`}
              </td>
              <td>{entry.player}</td>
              <td>{entry.score}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
