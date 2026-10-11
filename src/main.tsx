import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Three stylesheets, in cascade order — the last one wins, and it is the only one this repo owns:
//   engine — react-flow + the IBM Plex faces its code-node metrics are calibrated to
//   shell  — the concept-app layout and surface (it paints --bg, which SceneView assumes)
//   theme  — this repo's three brand tokens
// The order is load-bearing: theme last, or this repo's brand loses to the shell's neutral defaults.
import '@graphlearning/flow/styles.css'
import '@graphlearning/shell/styles.css'
import './theme.css'
import { ConceptApp } from '@graphlearning/shell'
import { COURSES } from './content'
import { getScene } from './scenes'

// The whole app. Router, section view, slide panel, catalog and narration are all
// @graphlearning/shell; this repo supplies its two registries and its name.
//
// audioBase must be passed from here: import.meta.env.BASE_URL is replaced at THIS app's build time
// (vite `base` = "/<repo-slug>/"), and the shell is built separately, so it cannot read it.
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
