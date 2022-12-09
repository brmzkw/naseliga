import { Prisma } from '@prisma/client'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';

import { router, publicProcedure } from "../trpc";

export type PlayersRouterInput = inferRouterInputs<typeof playersRouter>;
export type PlayersRouterOutput = inferRouterOutputs<typeof playersRouter>;

const playerData = Prisma.validator<Prisma.PlayerArgs>()({
    select: {
        id: true,
        name: true,
        country: true,
    }
});

export const playersRouter = router({
    list: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.player.findMany({
            select: playerData.select,
            orderBy: {
                name: 'asc',
            },
        });
    }),

    create: publicProcedure
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

    delete: publicProcedure
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

    edit: publicProcedure
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