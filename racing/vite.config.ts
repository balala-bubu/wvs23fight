import { defineConfig } from 'vitest/config'
export default defineConfig({base:'./',server:{host:'0.0.0.0',fs:{allow:['..']}},build:{target:'es2022',assetsInlineLimit:0},test:{environment:'node',include:['tests/**/*.test.ts']}})
