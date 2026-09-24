import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The render engine is the @graphlearning/flow package and the app shell is @graphlearning/shell —
// both consumed by version, never as `file:../`. `dedupe` keeps a single copy of react / react-dom /
// @xyflow/react across this app and the packages: the gotcha that bites when two React copies meet
// (invalid-hook-call). The packages declare them as peer deps and externalise them, so neither
// carries its own React; dedupe is the belt to that braces. jsx is automatic via @vitejs/plugin-react.
//
// `base` is `/apache-spark-ct/` for the production BUILD only (the app deploys under
// graphl.in/apache-spark-ct/ as a concept app in the GraphL catalog), so built asset URLs are
// subpath-relative. Dev/serve stays at `/` so `npm run dev` and the capture/record scripts (which
// drive the dev server at localhost:5173/#/<id>) are unaffected.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/apache-spark-ct/' : '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@xyflow/react'],
  },
  server: { port: 5173 },
}))
