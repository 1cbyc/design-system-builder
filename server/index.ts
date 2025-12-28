import { router } from './trpc'
import { projectRouter } from './routers/project'
import { componentRouter } from './routers/component'
import { themeRouter } from './routers/theme'
import { pageRouter } from './routers/page'

export const appRouter = router({
  project: projectRouter,
  component: componentRouter,
  theme: themeRouter,
  page: pageRouter,
})

export type AppRouter = typeof appRouter
