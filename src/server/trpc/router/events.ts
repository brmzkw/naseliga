import { Prisma } from "@prisma/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc";

export type EventsRouterInput = inferRouterInputs<typeof eventsRouter>;
export type EventsRouterOutput = inferRouterOutputs<typeof eventsRouter>;

export const eventsRouter = router({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany({
      include: {
        matches: {
          include: {
            playerA: true,
            playerB: true,
            ranking: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.isAdmin) {
        throw new Error("Not authorized");
      }
      const event = await ctx.prisma.event.create({
        data: {
          title: input.title,
          date: input.date,
        },
      });
      return {
        event,
      };
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.isAdmin) {
        throw new Error("Not authorized");
      }
      try {
        const event = await ctx.prisma.event.delete({
          where: {
            id: input.id,
          },
        });
        return {
          event,
        };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // Foreign key constraint failed
          if (e.code == "P2003") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "It is impossible to remove an event containing matches",
            });
          }
        }
      }
    }),

  createMatch: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        playerAId: z.number(),
        scoreA: z.number(),
        playerBId: z.number(),
        scoreB: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.isAdmin) {
        throw new Error("Not authorized");
      }
      const match = await ctx.prisma.match.create({
        data: {
          event: {
            connect: {
              id: input.eventId,
            },
          },
          playerA: {
            connect: {
              id: input.playerAId,
            },
          },
          scoreA: input.scoreA,
          playerB: {
            connect: {
              id: input.playerBId,
            },
          },
          scoreB: input.scoreB,
        },
      });
      return {
        match,
      };
    }),

  deleteMatch: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.isAdmin) {
        throw new Error("Not authorized");
      }
      try {
        const match = await ctx.prisma.match.delete({
          where: {
            id: input.id,
          },
        });
        return {
          match,
        };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // Foreign key constraint failed
          if (e.code == "P2003") {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "It is impossible to remove a match if the leaderboard has been generated since its creation",
            });
          }
        }
      }
    }),
});
