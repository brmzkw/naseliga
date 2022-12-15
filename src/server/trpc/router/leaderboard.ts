import { Prisma, PrismaClient } from '@prisma/client'
import { z } from 'zod';

import { router, publicProcedure } from "../trpc";

const playerData = Prisma.validator<Prisma.PlayerArgs>()({
    select: {
        id: true,
        name: true,
        country: true,
    }
});

type Player = Prisma.PlayerGetPayload<typeof playerData>
export type PlayerWithScore = Player & { score: number }

export const leaderboardRouter = router({
    get: publicProcedure
        .input(z.object({
            after: z.date()
        }).default(() => {
            const after = new Date();
            // three months ago
            after.setMonth(after.getMonth() - 2);
            return ({
                after,
            })
        }))
        .query(async ({ ctx, input }) => {
            const leaderboard = await ctx.prisma.$queryRaw<PlayerWithScore[]>(
                Prisma.sql`
                SELECT
                    *
                FROM (
                    SELECT
                        DISTINCT ON (player) id,
                        players.country,
                        players.name,
                        score
                    FROM (
                        SELECT
                            players.id player
                            , matches.id match
                            , rankings.rank_a score
                        FROM rankings
                        JOIN matches
                            ON rankings.match = matches.id
                        JOIN events
                            ON events.id = matches.event
                        JOIN players
                            ON players.id = matches.player_a
                        WHERE
                            events.date >= ${input.after}

                        UNION

                        SELECT
                            players.id player
                            , matches.id match
                            , rankings.rank_b score
                        FROM rankings
                        JOIN matches
                            ON rankings.match = matches.id
                        JOIN events
                            ON events.id = matches.event
                        JOIN players
                            ON players.id = matches.player_b
                        WHERE
                            events.date >= ${input.after}
                    ) subq
                    JOIN players
                        ON players.id = subq.player
                    ORDER BY player, match DESC
                ) subq ORDER BY score DESC
        `);
            return {
                leaderboard,
            };
        }),

    update: publicProcedure
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session?.user?.isAdmin) {
                throw new Error('Not authorized');
            }
            const events = await listUnrankedEvents(ctx.prisma);

            for (const event of events) {
                for (const match of event.matches) {
                    const [newRankA, newRankB] = await getNewRankings(
                        ctx.prisma,
                        match.playerAId, match.scoreA,
                        match.playerBId, match.scoreB
                    );

                    await ctx.prisma.ranking.upsert({
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
        }),
});

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
 * Return the latest ranking of a player.
 */
export async function getPlayerRanking(
    prisma: PrismaClient,
    playerId: number
) {
    const match = await prisma.match.findFirst({
        where: {
            OR: [
                { playerAId: playerId },
                { playerBId: playerId },
            ],
            NOT: { ranking: null },
        },
        include: {
            ranking: true,
        },
        orderBy: {
            id: 'desc',
        },
    });

    if (!match?.ranking) {
        return 1500;
    }
    return match.playerAId === playerId ? match.ranking.rankA : match.ranking.rankB;
}

/*
 * Given two players and their scores, return the new rankings of each player.
 */
async function getNewRankings(
    prisma: PrismaClient,
    playerAId: number,
    scoreA: number,
    playerBId: number,
    scoreB: number
): Promise<[number, number]> {
    const rankA = await getPlayerRanking(prisma, playerAId);
    const rankB = await getPlayerRanking(prisma, playerBId);

    const [newRankA, newRankB] = computeNewScores(
        rankA, rankB, scoreA, scoreA + scoreB
    );
    return [newRankA, newRankB];
}

/*
 * List events with as least one unranked match.
 */
export async function listUnrankedEvents(prisma: PrismaClient) {
    return prisma.event.findMany({
        include: {
            matches: {
                include: {
                    playerA: true,
                    playerB: true,
                }
            },
        },
        where: {
            matches: {
                some: {
                    ranking: null,
                }
            },
        },
        orderBy: {
            id: 'asc',
        },
    });
}