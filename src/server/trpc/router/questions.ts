import { protectedProcedure, router } from "../trpc";

import { z } from "zod";

export const questionsRouter = router({
  getQuestionsBySessionId: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const sessionQuestions = await ctx.prisma.question.findMany({
        where: {
          groupSessionId: input.sessionId,
        },
      });
      // TODO: double check return shape/value
      return sessionQuestions;
    }),
});
