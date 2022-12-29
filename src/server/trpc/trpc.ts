import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,

  // By default, trpc sends the stack trace of the error to the client. Remove
  // these sensitive details before sending to the client.
  errorFormatter({ error, shape }) {
    const safeMessage =
      error.code === "INTERNAL_SERVER_ERROR"
        ? "Internal server error"
        : shape.message;
    const { stack, path, ...safeData } = shape.data;

    return {
      ...shape,
      message: safeMessage,
      data: {
        ...safeData,
      },
    };
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
