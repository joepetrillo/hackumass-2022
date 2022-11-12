import { protectedProcedure, router } from "../trpc";

import { z } from "zod";

export const groupSessionsRouter = router({
  getSessionsByGroupId: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      const groupSessions = await ctx.prisma.groupSession.findMany({
        where: {
          groupId: input.groupId,
        },
      });
      // TODO: double check return shape/value
      return groupSessions;
    }),
});
