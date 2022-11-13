import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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

  getGroupByGroupId: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
        },
      });

      if (group === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group with id ${input.groupId} does not exist`,
        });
      }

      const relation = await ctx.prisma.member.findFirst({
        where: {
          groupId: input.groupId,
          userId: ctx.session.user.id,
        },
      });

      if (relation === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You have not joined this group. Add yourself using a provided access code.`,
        });
      }

      let isOwner = false;

      if (group.ownerId === ctx.session.user.id) isOwner = true;

      const owner = await ctx.prisma.user.findFirst({
        where: {
          id: group.ownerId,
        },
      });

      if (owner === null || owner.name === null) {
        return { error: `Owner does not exist.` };
      }

      return {
        groupData: { ...group, ownerName: owner.name },
        isOwner: isOwner,
      };
    }),
});
