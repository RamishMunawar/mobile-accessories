import { Suspense, useRef, useLayoutEffect, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
  OrbitControls,
  useGLTF,
  useFBX,
  useProgress,
  Html,
  Environment,
  ContactShadows,
  Center,
} from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

function deg2rad(d) {
  return (d * Math.PI) / 180
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-lg text-exclusive-muted">{`${Math.round(progress)} %`}</div>
    </Html>
  )
}

function GltfContent({ url, onLoaded }) {
  const { scene } = useGLTF(url)
  useLayoutEffect(() => {
    if (!scene) return
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    onLoaded()
  }, [scene, onLoaded])
  return <primitive object={scene.clone()} />
}

function FbxContent({ url, onLoaded }) {
  const fbx = useFBX(url)
  useLayoutEffect(() => {
    if (!fbx) return
    fbx.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    onLoaded()
  }, [fbx, onLoaded])
  return <primitive object={fbx.clone()} />
}

function ObjContent({ url, onLoaded }) {
  const obj = useLoader(OBJLoader, url)
  useLayoutEffect(() => {
    if (!obj) return
    obj.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    onLoaded()
  }, [obj, onLoaded])
  return <primitive object={obj.clone()} />
}

function SceneContent({ url, autoRotate, autoRotateSpeed, onLoaded }) {
  const modelRef = useRef(null)
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0]

  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += (autoRotateSpeed || 1) * delta
      state.invalidate()
    }
  })

  const onLoadedHandler = useCallback(() => {
    onLoaded?.()
  }, [onLoaded])

  let inner = null
  switch (ext) {
    case 'glb':
    case 'gltf':
      inner = <GltfContent url={url} onLoaded={onLoadedHandler} />
      break
    case 'fbx':
      inner = <FbxContent url={url} onLoaded={onLoadedHandler} />
      break
    case 'obj':
      inner = <ObjContent url={url} onLoaded={onLoadedHandler} />
      break
    default:
      inner = null
  }

  return (
    <Center>
      <group ref={modelRef}>{inner}</group>
    </Center>
  )
}

export default function ModelViewer({
  url,
  width = '100%',
  height = '100%',
  defaultZoom = 2,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableManualRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.3,
  keyLightIntensity = 1,
  fillLightIntensity = 0.5,
  rimLightIntensity = 0.8,
  environmentPreset = 'forest',
  autoRotate = false,
  autoRotateSpeed = 0.35,
  orbitAutoRotate,
  onModelLoaded,
}) {
  const orbitAuto =
    orbitAutoRotate ?? (isTouch ? false : autoRotate)
  useEffect(() => {
    const raw = url.split('.').pop()?.toLowerCase() ?? ''
    const ext = raw.split('?')[0]
    if (ext === 'glb' || ext === 'gltf') {
      useGLTF.preload(url)
    }
  }, [url])

  return (
    <div style={{ width, height }} className="relative overflow-hidden rounded-lg border border-app-border-subtle bg-app-muted">
      <Canvas
        shadows
        camera={{
          fov: 50,
          position: [0, 0, defaultZoom],
          near: 0.01,
          far: 100,
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        frameloop="demand"
      >
        <Suspense fallback={<Loader />}>
          <SceneContent
            url={url}
            autoRotate={autoRotate}
            autoRotateSpeed={deg2rad(autoRotateSpeed)}
            onLoaded={onModelLoaded}
          />
        </Suspense>

        {environmentPreset !== 'none' ? (
          <Environment preset={environmentPreset} />
        ) : null}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={keyLightIntensity}
          castShadow
        />
        <directionalLight position={[-5, 2, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <ContactShadows position={[0, -0.5, 0]} opacity={0.35} scale={10} blur={2} />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={enableManualRotation}
          enableZoom={enableManualZoom}
          minDistance={minZoomDistance}
          maxDistance={maxZoomDistance}
          autoRotate={orbitAuto}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Canvas>
    </div>
  )
}
