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

export const playersRouter = router({
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
            orderBy: {
                name: 'asc',
            },
        });
    }),

    addPlayer: publicProcedure
        .input(z.object({
            name: z.string(),
            country: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session?.user?.isAdmin) {
                throw new Error('Not authorized');
            }
            const player = await ctx.prisma.player.create({
                data: {
                    name: input.name,
                    country: input.country,
                },
            });
            return {
                player,
            };
        }),

    removePlayer: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session?.user?.isAdmin) {
                throw new Error('Not authorized');
            }
            const player = await ctx.prisma.player.delete({
                where: {
                    id: input.id,
                },
            });
            return {
                player,
            };
        }),

    editPlayer: publicProcedure
        .input(z.object({
            id: z.number(),
            name: z.string(),
            country: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session?.user?.isAdmin) {
                throw new Error('Not authorized');
            }
            const player = await ctx.prisma.player.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    country: input.country,
                },
            });
            return {
                player,
            };
        }),
});