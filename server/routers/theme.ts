import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const themeRouter = router({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.theme.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          isDefault: 'desc',
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        colors: z.any().optional(),
        typography: z.any().optional(),
        spacing: z.any().optional(),
        borderRadius: z.any().optional(),
        shadows: z.any().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If setting as default, unset other defaults
      if (input.isDefault) {
        await ctx.prisma.theme.updateMany({
          where: {
            projectId: input.projectId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        })
      }

      return ctx.prisma.theme.create({
        data: input,
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        colors: z.any().optional(),
        typography: z.any().optional(),
        spacing: z.any().optional(),
        borderRadius: z.any().optional(),
        shadows: z.any().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const theme = await ctx.prisma.theme.findUnique({
        where: { id },
      })

      if (!theme) {
        throw new Error('Theme not found')
      }

      // If setting as default, unset other defaults
      if (input.isDefault) {
        await ctx.prisma.theme.updateMany({
          where: {
            projectId: theme.projectId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        })
      }

      return ctx.prisma.theme.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.theme.delete({
        where: { id: input.id },
      })
    }),
})
