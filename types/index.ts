export interface ComponentProp {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}

export interface ComponentVariant {
  name: string
  props: Record<string, any>
}

export interface ComponentExample {
  name: string
  code: string
  description?: string
}

export interface DesignToken {
  name: string
  value: string
  description?: string
}

export interface ColorPalette {
  primary: Record<string, string>
  secondary: Record<string, string>
  neutral: Record<string, string>
  success: Record<string, string>
  warning: Record<string, string>
  error: Record<string, string>
}

export interface Typography {
  fontFamily: {
    sans: string
    serif: string
    mono: string
  }
  fontSize: Record<string, string>
  fontWeight: Record<string, number>
  lineHeight: Record<string, string>
  letterSpacing: Record<string, string>
}

export interface Spacing {
  scale: Record<string, string>
}

export interface ThemeConfig {
  colors: ColorPalette
  typography: Typography
  spacing: Spacing
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}

export type Framework = 'react' | 'vue' | 'svelte'
export type ComponentStatus = 'draft' | 'published'
