import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const componentRouter = router({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.component.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.component.findUnique({
        where: {
          id: input.id,
        },
        include: {
          versions: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        category: z.string(),
        description: z.string().optional(),
        props: z.any().optional(),
        code: z.string(),
        styles: z.string().optional(),
        variants: z.any().optional(),
        examples: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.component.create({
        data: input,
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        props: z.any().optional(),
        code: z.string().optional(),
        styles: z.string().optional(),
        variants: z.any().optional(),
        examples: z.any().optional(),
        status: z.enum(['draft', 'published']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      return ctx.prisma.component.update({
        where: { id },
        data,
      })
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const component = await ctx.prisma.component.findUnique({
        where: { id: input.id },
      })

      if (!component) {
        throw new Error('Component not found')
      }

      // Create a version snapshot
      await ctx.prisma.version.create({
        data: {
          componentId: component.id,
          version: component.version,
          code: component.code,
          changelog: 'Published version',
        },
      })

      return ctx.prisma.component.update({
        where: { id: input.id },
        data: {
          status: 'published',
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.component.delete({
        where: { id: input.id },
      })
    }),
})
