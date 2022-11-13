import { protectedProcedure, router } from "../trpc";

import { z } from "zod";

export const membersRouter = router({
  createMemberRelation: protectedProcedure
    .input(
      z.object({
        accessCode: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findMany({
        where: {
          accessCode: input.accessCode,
        },
      });

      if (group.length === 0) {
        return {
          error: `No group with access code ${input.accessCode} exists`,
        };
      }

      if (group.length > 1) {
        return {
          error: "Somehow there are multiple groups with the same access code",
        };
      }

      const g = group[0];

      if (g === undefined) {
        return { error: "Group obect is broken" };
      }

      const newMemberRelation = await ctx.prisma.member.create({
        data: {
          groupId: g.id,
          userId: ctx.session.user.id,
        },
      });

      return newMemberRelation;
    }),
});
