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

      return sessionQuestions;
    }),

  getQuestionsByQuestionId: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const question = await ctx.prisma.question.findFirst({
        where: {
          id: input.questionId,
        },
      });

      if (question === null) {
        return { error: `Question with id ${input.questionId} does not exist` };
      }

      return question.numOptions;
    }),
});
