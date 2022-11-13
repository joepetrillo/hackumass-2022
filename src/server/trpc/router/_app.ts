import { authRouter } from "./auth";
import { groupSessionsRouter } from "./groupSessions";
import { groupsRouter } from "./groups";
import { questionsRouter } from "./questions";
import { responsesRouter } from "./responses";
import { router } from "../trpc";
import { membersRouter } from "./members";

export const appRouter = router({
  auth: authRouter,
  groups: groupsRouter,
  groupSessions: groupSessionsRouter,
  questions: questionsRouter,
  responses: responsesRouter,
  members: membersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
