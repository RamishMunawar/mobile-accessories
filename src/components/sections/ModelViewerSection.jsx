import { Component } from 'react'
import ModelViewer from '../ui/ModelViewer'
import SectionHeading from '../ui/SectionHeading'

/** Stable demo GLB (CORS + HTTPS). Replace with `/models/yours.glb` in `public/` if you prefer offline. */
const DEFAULT_MODEL_URL =
  'https://modelviewer.dev/shared-assets/models/Astronaut.glb'

class ModelViewerBoundary extends Component {
  state = { err: false }

  static getDerivedStateFromError() {
    return { err: true }
  }

  render() {
    if (this.state.err) {
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border border-app-border-subtle bg-app-muted px-6 py-16 text-center text-exclusive-muted">
          <p className="font-medium text-exclusive-dark">3D model could not be loaded.</p>
          <p className="mt-2 text-sm">Check the model URL, CORS, and your network, then refresh.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default function ModelViewerSection({
  url = DEFAULT_MODEL_URL,
  autoRotate = true,
}) {
  return (
    <section
      id="model-viewer"
      className="scroll-mt-28 border-t border-app-border-subtle py-16 lg:py-20"
      aria-label="3D product viewer"
    >
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <SectionHeading eyebrow="Explore" title="3D Model Viewer" />
        <div className="h-[min(70vh,520px)] min-h-[360px] w-full md:h-[min(72vh,560px)]">
          <ModelViewerBoundary key={url}>
            <ModelViewer
              url={url}
              width="100%"
              height="100%"
              environmentPreset="forest"
              autoRotate={autoRotate}
              orbitAutoRotate={false}
              autoRotateSpeed={0.35}
              enableManualRotation
              enableManualZoom
            />
          </ModelViewerBoundary>
        </div>
      </div>
    </section>
  )
}
