import type { NextApiRequest, NextApiResponse } from 'next'

import {
  LeaderBoardAPIResponse,
  LeaderBoardMatch,
  LeaderBoardEntry,
} from '../../types/api';

import SCORES from '../../scores.json';


function computeNewScores(
  score_a: number,
  score_b: number,
  rounds_a: number,
  total_rounds: number
): [number, number] {
  const qa = Math.pow(10, score_a / 400);
  const qb = Math.pow(10, score_b / 400);

  const expected_a_on_b = qa / (qa + qb)
  const expected_b_on_a = 1 - expected_a_on_b

  const percent_win_a = rounds_a * 100 / total_rounds
  const percent_win_b = 100 - percent_win_a

  const new_a = score_a + (percent_win_a - expected_a_on_b * 100)
  const new_b = score_b + (percent_win_b - expected_b_on_a * 100)

  return [new_a, new_b];
}

function computeScores(matches: LeaderBoardMatch[]): LeaderBoardEntry[] {
  const scores: {[player: string]: number} = {};

  matches.forEach((match) => {
    if (!(match.player_a in scores)) {
      scores[match.player_a] = 1500;
    }
    if (!(match.player_b in scores)) {
      scores[match.player_b] = 1500;
    }

    const [new_score_a, new_score_b] = computeNewScores(
      scores[match.player_a],
      scores[match.player_b],
      match.score_a,
      match.score_a + match.score_b
    );

    scores[match.player_a] = Math.round(new_score_a);
    scores[match.player_b] = Math.round(new_score_b);
  });

  // Sort by score DESC
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]).reverse();
  return sorted.map(([player, score]) => ({player, score}));
}

async function leaderBoard(): Promise<LeaderBoardAPIResponse> {
  const leaderboard = computeScores(
    SCORES.map((event) => event.matches).flat()
  );

  return {
    events: SCORES,
    leaderboard,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderBoardAPIResponse>
) {
  const data = await leaderBoard();
  res.status(200).json(data);
}
