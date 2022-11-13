import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const responsesRouter = router({
  createResponse: protectedProcedure
    .input(z.object({ response: z.string(), questionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const curQuestion = await ctx.prisma.question.findFirst({
        where: {
          id: input.questionId,
        },
      });

      if (curQuestion === null) {
        return { error: `Question with id ${input.questionId} does not exist` };
      }

      let isCorrect = false;

      if (curQuestion.correct === input.response) isCorrect = true;

      const newResponse = await ctx.prisma.response.create({
        data: {
          userId: ctx.session.user.id,
          questionId: input.questionId,
          response: input.response,
          isCorrect: isCorrect,
        },
      });

      return newResponse;
    }),

  getResponsesByQuestionId: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const questionResponses = await ctx.prisma.response.findMany({
        where: {
          questionId: input.questionId,
        },
      });

      // potentially append user's names and pictures as well

      return questionResponses;
    }),
});
