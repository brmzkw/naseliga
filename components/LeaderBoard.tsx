import styles from '../styles/LeaderBoard.module.css';
import { LeaderBoardAPIResponse } from '../types/api';

import useSWR from 'swr'

export default function LeaderBoard() {
  const { data, error } = useSWR<LeaderBoardAPIResponse>(
    '/api/leaderboard',
    (url) => fetch(url).then((resp) => resp.json())
  );

  if (!data) {
    return null;
  }

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.leaderboard.map((score) =>
            <tr key={score.player}>
              <td>{score.player}</td>
              <td>{score.score}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
