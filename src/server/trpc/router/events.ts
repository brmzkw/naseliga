import { router, publicProcedure } from "../trpc";

export const eventsRouter = router({
    list: publicProcedure.query(({ ctx }) => {
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
});