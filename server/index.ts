import { router } from './trpc'
import { projectRouter } from './routers/project'
import { componentRouter } from './routers/component'
import { themeRouter } from './routers/theme'

export const appRouter = router({
  project: projectRouter,
  component: componentRouter,
  theme: themeRouter,
})

export type AppRouter = typeof appRouter
