import { Prisma } from '@prisma/client'
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

export const naseligaRouter = router({
    getLeaderBoard: publicProcedure
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

    getEvents: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.event.findMany({
            include: {
                matches: {
                    include: {
                        playerA: true,
                        playerB: true,
                    }
                },
            },
            orderBy: {
                id: 'desc',
            },
        });
    }),

    getPlayers: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.player.findMany({
            select: playerData.select,
        });
    }),
});