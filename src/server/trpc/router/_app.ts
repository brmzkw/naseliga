import { router } from "../trpc";
import { authRouter } from "./auth";
import { naseligaRouter } from "./naseliga";

export const appRouter = router({
  auth: authRouter,
  naseliga: naseligaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
