import {
  prisma,
  listUnrankedEvents,
  getPlayerRanking,
  listLeaderboard,
} from './db';


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

  return [Math.round(newA), Math.round(newB)];
}

/*
 * Given two players and their scores, return the new rankings of each player.
 */
async function getNewRankings(
  playerAId : number,
  scoreA : number,
  playerBId : number,
  scoreB : number
) {
  const rankA = await getPlayerRanking(playerAId);
  const rankB = await getPlayerRanking(playerBId);

  const [newRankA, newRankB] = computeNewScores(
    rankA, rankB, scoreA, scoreA + scoreB
  );
  return [newRankA, newRankB];
}

async function main() {
  const events = await listUnrankedEvents();

  for (let event of events) {
    for (let match of event.matches) {
      const [newRankA, newRankB] = await getNewRankings(match.playerAId, match.scoreA, match.playerBId, match.scoreB);

        await prisma.ranking.upsert({
          where: {
            matchId: match.id,
          },
          update: {
            rankA: newRankA,
            rankB: newRankB,
          },
          create: {
            matchId: match.id,
            rankA: newRankA,
            rankB: newRankB,
          },
        });
    }
  }

  const entries = await listLeaderboard();
  for (const entry of entries) {
    console.log(`[${entry.player.country}] ${entry.score} - ${entry.player.name}`);
  }

  await prisma.$disconnect();
}

main();
