import { Prisma } from '@prisma/client'

import { prisma } from '../db';

/*
 * Returns the list of events such as:
 *
 * {
 *   id: <int>
 *   title: <string>
 *   date: <date>
 *   matches: [
 *     {
 *       playerA: { name: <string>, country: <string> }
 *       playerB: { name: <string>, country: <string> }
 *       scoreA: <int>
 *       scoreB: <int>
 *     },
 *     ...
 *   ],
 *   ...
 * }
 *
 */
export async function getEventsWithMatches() {
  return prisma.event.findMany({
      include: {
        matches: {
          include: {
            playerA: true,
            playerB: true,
          }
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
}

type EventsWithMatches = Prisma.PromiseReturnType<typeof getEventsWithMatches>;

export type Match = {
  playerA: string
  playerB: string
  scoreA: number
  scoreB: number
}

export type Event = {
  date: string
  matches: Match[]
}

export type LeaderBoardEntry = {
  player: string
  score: number
}

/*
 * Given the scores of two players, the number of rounds won by A and the total
 * number of rounds played, returns the new scores for both players.
 *
 * https://en.wikipedia.org/wiki/Elo_rating_system
 */
function computeNewScores(
  scoreA: number,
  scoreB: number,
  roundsA: number,
  totalRounds: number
): [number, number] {
  const qa = Math.pow(10, scoreA / 400);
  const qb = Math.pow(10, scoreB / 400);

  const expectedAOnB = qa / (qa + qb)
  const expectedBOnA = 1 - expectedAOnB

  const percentWinA = roundsA * 100 / totalRounds
  const percentWinB = 100 - percentWinA

  const newA = scoreA + (percentWinA - expectedAOnB * 100)
  const newB = scoreB + (percentWinB - expectedBOnA * 100)

  return [newA, newB];
}

function computeScores(matches: Match[]): LeaderBoardEntry[] {
  const scores: {[player: string]: number} = {};

  matches.forEach((match) => {
    if (!(match.playerA in scores)) {
      scores[match.playerA] = 1500;
    }
    if (!(match.playerB in scores)) {
      scores[match.playerB] = 1500;
    }

    const [newScoreA, newScoreB] = computeNewScores(
      scores[match.playerA],
      scores[match.playerB],
      match.scoreA,
      match.scoreA + match.scoreB
    );

    scores[match.playerA] = Math.round(newScoreA);
    scores[match.playerB] = Math.round(newScoreB);
  });

  // Sort by score DESC
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]).reverse();
  return sorted.map(([player, score]) => ({player, score}));
}

export default class Naseliga {
  public events: Event[]
  public leaderboard: LeaderBoardEntry[]

  constructor(events : EventsWithMatches) {
    this.events = events.map((event) => ({
      date: event.date.toDateString(),
      matches: event.matches.map((match) => ({
        playerA: match.playerA.name,
        playerB: match.playerB.name,
        scoreA: match.scoreA,
        scoreB: match.scoreB,
      })),
    }));

    this.leaderboard = computeScores(
      events.map((event) => event.matches.map((match) => ({
        playerA: match.playerA.name,
        playerB: match.playerB.name,
        scoreA: match.scoreA,
        scoreB: match.scoreB,
      }))).flat()
    );
  }
}
