// See: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices


import { Prisma, PrismaClient } from '@prisma/client'


declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}


/*
 * Returns the list of all events such as:
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
export async function listAllEvents() {
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

export type ListAllEvents = Prisma.PromiseReturnType<typeof listAllEvents>;


/*
 * Similar to listAllEvents, but limit to events with as least one unranked match.
 */
export async function listUnrankedEvents() {
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

export type ListUnrankedEvents = Prisma.PromiseReturnType<typeof listUnrankedEvents>;

/*
 * Return the latest ranking of a player.
 */
export async function getPlayerRanking(
  playerId: number
) {
  const match = await prisma.match.findFirst({
    where: {
      OR: [
        {playerAId: playerId},
        {playerBId: playerId},
      ],
      NOT: {ranking: null},
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

export type GetPlayerRanking = Prisma.PromiseReturnType<typeof getPlayerRanking>;


/*
 * Return the leaderboard.
 */
export async function listLeaderboard() {
  return prisma.leaderboard.findMany({
    include: {
      player: true,
    },
    orderBy: {
      score: 'desc',
    },
  });
}

export type ListLeaderboard = Prisma.PromiseReturnType<typeof listLeaderboard>;
