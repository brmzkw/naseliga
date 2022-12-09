import { router } from "../trpc";
import { authRouter } from "./auth";
import { eventsRouter } from "./events";
import { leaderboardRouter } from "./leaderboard";
import { playersRouter } from "./players";

export const appRouter = router({
  auth: authRouter,
  leaderboard: leaderboardRouter,
  players: playersRouter,
  events: eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
