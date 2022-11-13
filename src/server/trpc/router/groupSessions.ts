import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const groupSessionsRouter = router({
  createSession: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        name: z.string(),
        questions: z.array(
          z.object({ numOptions: z.number(), correct: z.string() })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.questions.length === 0) {
        return { error: `Need at least one question` };
      }

      const newSession = await ctx.prisma.groupSession.create({
        data: {
          groupId: input.groupId,
          expired: false,
          name: input.name,
          accessCode: [...Array(6)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(""),
        },
      });

      input.questions.forEach(async (question) => {
        ctx.prisma.question.create({
          data: {
            numOptions: question.numOptions,
            correct: question.correct,
            groupSessionId: newSession.id,
          },
        });
      });
    }),

  getSessionsByGroupId: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      const groupSessions = await ctx.prisma.groupSession.findMany({
        where: {
          groupId: input.groupId,
        },
      });

      return groupSessions;
    }),
});
