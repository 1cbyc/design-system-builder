import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const projectRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        _count: {
          select: {
            components: true,
            themes: true,
            pages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          components: true,
          themes: true,
          pages: true,
        },
      })

      if (!project || project.userId !== ctx.session.user.id) {
        throw new Error('Project not found')
      }

      return project
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.project.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        typography: z.any().optional(),
        spacing: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const project = await ctx.prisma.project.findUnique({
        where: { id },
      })

      if (!project || project.userId !== ctx.session.user.id) {
        throw new Error('Project not found')
      }

      return ctx.prisma.project.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      })

      if (!project || project.userId !== ctx.session.user.id) {
        throw new Error('Project not found')
      }

      return ctx.prisma.project.delete({
        where: { id: input.id },
      })
    }),
})
