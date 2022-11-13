import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const groupsRouter = router({
  createGroup: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newGroup = await ctx.prisma.group.create({
        data: {
          name: input.name,
          description: input.description,
          ownerId: ctx.session.user.id,
        },
      });

      await ctx.prisma.member.create({
        data: {
          userId: ctx.session.user.id,
          groupId: newGroup.id,
        },
      });

      return newGroup;
    }),

  getGroupsByUserId: protectedProcedure.query(async ({ ctx }) => {
    const sessionUserId: string = ctx?.session?.user?.id;

    const userGroups = await ctx.prisma.member
      .findMany({
        where: {
          userId: sessionUserId,
        },
        select: {
          Group: true,
        },
      })
      .then((data) => data.map((group) => group.Group));

    const ownedGroups = userGroups.filter(
      (cur) => cur.ownerId === sessionUserId
    );

    const joinedGroups = userGroups.filter(
      (cur) => cur.ownerId !== sessionUserId
    );

    return { ownedGroups: ownedGroups, joinedGroups: joinedGroups };
  }),
});
