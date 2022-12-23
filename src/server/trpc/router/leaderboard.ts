import { Prisma, type PrismaClient } from '@prisma/client'
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
            after.setMonth(after.getMonth() - 3);
            return ({
                after,
            })
        }))
        .query(async ({ ctx, input }) => {
            const leaderboard = await ctx.prisma.$queryRaw<PlayerWithScore[]>(
                Prisma.sql`
                    SELECT
                        subq.player_id AS id,
                        subq.player_name AS name,
                        subq.player_country AS country,
                        1500 + SUM(subq.score) :: INT AS score
                    FROM (
                        SELECT
                            players.id AS player_id
                            , players.name AS player_name
                            , players.country AS player_country
                            , rankings.rank_a AS score
                        FROM
                            rankings
                        JOIN matches
                            ON matches.id = rankings.match
                        JOIN events
                            ON events.id = matches.event
                        JOIN players
                            ON players.id = matches.player_a

                        UNION

                        SELECT
                            players.id AS player_id
                            , players.name AS player_name
                            , players.country AS player_country
                            , rankings.rank_b AS score
                        FROM
                            rankings
                        JOIN matches
                            ON matches.id = rankings.match
                        JOIN events
                            ON events.id = matches.event
                        JOIN players
                            ON players.id = matches.player_b
                    ) subq

                    JOIN (
                        SELECT players.id AS player_id
                        FROM players
                        JOIN matches
                        ON matches.player_a = players.id OR matches.player_b = players.id
                        JOIN events
                        ON events.id = matches.event
                        WHERE events.date >= ${input.after}
                        GROUP BY players.id
                    ) subq2
                    ON subq2.player_id = subq.player_id

                    GROUP BY
                        subq.player_id,
                        subq.player_name,
                        subq.player_country
                    ORDER BY
                        SUM(subq.score) DESC
                `);
            return {
                leaderboard,
            };
        }),

    update: publicProcedure
        .mutation(async ({ ctx }) => {
            if (!ctx.session?.user?.isAdmin) {
                throw new Error('Not authorized');
            }

            const events = await listUnrankedEvents(ctx.prisma);
            console.log(`Updating rankings for ${events.length} events...`);

            for (const event of events) {
                for (const match of event.matches) {
                    const [newRankA, newRankB] = await getMatchRanking(
                        ctx.prisma,
                        match
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
    if (!totalRounds) {
        return [scoreA, scoreB];
    }

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

/*
 * For a given match, return the previous ranking of both players.
 */
async function getPreviousMatchRanking(
    prisma: PrismaClient,
    match: Awaited<ReturnType<typeof listUnrankedEvents>>[number]['matches'][number]
): Promise<[number, number]> {
    const currentLeaderboardResult = await prisma.$queryRaw<{
        id: number;
        score: number;
    }[]>(
        Prisma.sql`
    SELECT
        player_id AS id,
        SUM(score) :: INT AS score
    FROM (
        SELECT
            players.id AS player_id
            , rankings.rank_a AS score
        FROM
            rankings
        JOIN matches
        ON matches.id = rankings.match
        JOIN players
        ON players.id = matches.player_a
        WHERE
            matches.id < ${match.id}

        UNION

        SELECT
            players.id AS player_id
            , rankings.rank_b AS score
        FROM
            rankings
        JOIN matches
        ON matches.id = rankings.match
        JOIN players
        ON players.id = matches.player_b
        WHERE
            matches.id < ${match.id}
    ) subq

    GROUP BY
        player_id
    ORDER BY
        score DESC
`);

    const currentLeaderboard = Object.fromEntries(
        currentLeaderboardResult.map((entry) => [entry.id, entry.score])
    );

    return [
        currentLeaderboard[match.playerA.id] || 0,
        currentLeaderboard[match.playerB.id] || 0
    ];
}

/*
 * Return the new ranking of both players for a given match.
 */
async function getMatchRanking(
    prisma: PrismaClient,
    match: Awaited<ReturnType<typeof listUnrankedEvents>>[number]['matches'][number]
): Promise<[number, number]> {
    const currentRankings = await getPreviousMatchRanking(prisma, match);
    const newScores = computeNewScores(
        currentRankings[0],
        currentRankings[1],
        match.scoreA,
        match.scoreA + match.scoreB
    );

    return [
        newScores[0] - currentRankings[0],
        newScores[1] - currentRankings[1]
    ];
}