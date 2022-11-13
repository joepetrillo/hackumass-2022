import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const responsesRouter = router({
  getResponsesByQuestionId: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const questionResponses = await ctx.prisma.response.findMany({
        where: {
          questionId: input.questionId,
        },
      });
      // TODO: double check return shape/value
      return questionResponses;
    }),
});
