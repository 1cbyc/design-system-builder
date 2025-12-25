import { Framework } from '@/types'

interface GenerateComponentOptions {
  name: string
  code: string
  props?: Record<string, any>
  framework: Framework
}

export function generateReactComponent({
  name,
  code,
  props = {},
}: Omit<GenerateComponentOptions, 'framework'>): string {
  const propsInterface = Object.keys(props).length > 0
    ? `
interface ${name}Props {
${Object.entries(props)
  .map(([key, value]) => `  ${key}: ${value.type};`)
  .join('\n')}
}
`
    : ''

  const propsParam = Object.keys(props).length > 0 ? `props: ${name}Props` : ''

  return `import React from 'react';
${propsInterface}
export const ${name} = (${propsParam}) => {
${code}
};

export default ${name};
`
}

export function generateVueComponent({
  name,
  code,
  props = {},
}: Omit<GenerateComponentOptions, 'framework'>): string {
  const propsDefinition = Object.keys(props).length > 0
    ? `
props: {
${Object.entries(props)
  .map(
    ([key, value]) => `  ${key}: {
    type: ${value.type},
    required: ${value.required || false},
    ${value.default ? `default: ${JSON.stringify(value.default)}` : ''}
  }`
  )
  .join(',\n')}
},`
    : ''

  return `<template>
${code}
</template>

<script setup lang="ts">
${propsDefinition}
</script>

<style scoped>
</style>
`
}

export function generateSvelteComponent({
  name,
  code,
  props = {},
}: Omit<GenerateComponentOptions, 'framework'>): string {
  const propsDeclaration = Object.keys(props).length > 0
    ? Object.entries(props)
        .map(([key, value]) => `export let ${key}${value.required ? '' : ' = ' + JSON.stringify(value.default || undefined)};`)
        .join('\n  ')
    : ''

  return `<script lang="ts">
  ${propsDeclaration}
</script>

${code}

<style>
</style>
`
}

export function generateComponent(options: GenerateComponentOptions): string {
  switch (options.framework) {
    case 'react':
      return generateReactComponent(options)
    case 'vue':
      return generateVueComponent(options)
    case 'svelte':
      return generateSvelteComponent(options)
    default:
      throw new Error(`Unsupported framework: ${options.framework}`)
  }
}
