import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Three stylesheets, in cascade order — the last one wins, and it is the only one this repo owns:
//   engine — react-flow + the IBM Plex faces its code-node metrics are calibrated to
//   shell  — the concept-app layout and surface (it paints --bg, which SceneView assumes)
//   theme  — this repo's three brand tokens
import '@graphlearning/flow/styles.css'
import '@graphlearning/shell/styles.css'
import './theme.css'
import { ConceptApp } from '@graphlearning/shell'
import { COURSES } from './content'
import { getScene } from './scenes'

// The whole app. The router, the composited scene-left / slide-right view, the catalog and the
// narration all live in @graphlearning/shell; this repo supplies its two registries and its name.
// audioBase must be passed from here: import.meta.env.BASE_URL is replaced at THIS app's build time
// (vite `base` = "/apache-spark-ct/"), and the shell is built separately, so it cannot read it.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConceptApp
      subject="Apache Spark"
      courses={COURSES}
      getScene={getScene}
      audioBase={import.meta.env.BASE_URL}
    />
  </StrictMode>,
)
