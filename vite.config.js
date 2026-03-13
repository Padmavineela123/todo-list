import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  base: '/taskmaker-react/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ]
})