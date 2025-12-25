import { ThemeConfig } from '@/types'

export function generateThemeCSS(theme: ThemeConfig): string {
  const cssVars: string[] = []

  // Colors
  Object.entries(theme.colors).forEach(([category, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      cssVars.push(`  --color-${category}-${shade}: ${value};`)
    })
  })

  // Typography
  Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
    cssVars.push(`  --font-${name}: ${value};`)
  })

  Object.entries(theme.typography.fontSize).forEach(([name, value]) => {
    cssVars.push(`  --text-${name}: ${value};`)
  })

  Object.entries(theme.typography.fontWeight).forEach(([name, value]) => {
    cssVars.push(`  --font-${name}: ${value};`)
  })

  // Spacing
  Object.entries(theme.spacing.scale).forEach(([name, value]) => {
    cssVars.push(`  --spacing-${name}: ${value};`)
  })

  // Border Radius
  Object.entries(theme.borderRadius).forEach(([name, value]) => {
    cssVars.push(`  --radius-${name}: ${value};`)
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([name, value]) => {
    cssVars.push(`  --shadow-${name}: ${value};`)
  })

  return `:root {
${cssVars.join('\n')}
}
`
}

export function generateThemeTailwind(theme: ThemeConfig): string {
  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(theme.colors, null, 2)},
      fontFamily: ${JSON.stringify(theme.typography.fontFamily, null, 2)},
      fontSize: ${JSON.stringify(theme.typography.fontSize, null, 2)},
      spacing: ${JSON.stringify(theme.spacing.scale, null, 2)},
      borderRadius: ${JSON.stringify(theme.borderRadius, null, 2)},
      boxShadow: ${JSON.stringify(theme.shadows, null, 2)},
    },
  },
}
`
}

export function generateThemeJSON(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2)
}
