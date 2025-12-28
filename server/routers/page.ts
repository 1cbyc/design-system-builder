import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const pageRouter = router({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.page.findMany({
        where: { 
          project: {
            slug: input.projectId
          }
        },
        orderBy: { createdAt: 'asc' },
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.page.findUnique({
        where: { id: input.id },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        slug: z.string(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { slug: input.projectId },
      })

      if (!project) {
        throw new Error('Project not found')
      }

      return ctx.prisma.page.create({
        data: {
          title: input.title,
          slug: input.slug,
          content: input.content || `# ${input.title}\n\nStart writing...`,
          projectId: project.id,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.page.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.page.delete({
        where: { id: input.id },
      })
    }),
})
