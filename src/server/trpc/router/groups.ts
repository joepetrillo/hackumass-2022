import { protectedProcedure, router } from "../trpc";

export const groupsRouter = router({
  getGroupsByUserId: protectedProcedure.query(async ({ ctx }) => {
    const sessionUserId: string = ctx?.session?.user?.id;

    const userGroups = await ctx.prisma.group.findMany({
      include: {
        Members: {
          where: {
            userId: sessionUserId,
          },
        },
      },
    });
    // TODO: double check return shape/value
    return userGroups;
  }),
});
