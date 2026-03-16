import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// ── Heart geometry ─────────────────────────────────────────
function buildHeartGeo(depth = 0.28, scale = 1 / 50) {
  const s = new THREE.Shape()
  s.moveTo(25, 25)
  s.bezierCurveTo(25, 25, 20,  0,   0,   0)
  s.bezierCurveTo(-30, 0,  -30, 35,  -30, 35)
  s.bezierCurveTo(-30, 55, -10, 77,  25,  95)
  s.bezierCurveTo(60,  77,  80,  55,  80,  35)
  s.bezierCurveTo(80,  35,  80,  0,   50,  0)
  s.bezierCurveTo(35,  0,   25,  25,  25,  25)

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: depth / scale,
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 4,
    bevelThickness: 4,
    curveSegments: 28,
  })
  geo.center()
  geo.scale(scale, scale, scale)
  geo.rotateX(Math.PI)
  return geo
}

// ── Main rotating heart ────────────────────────────────────
function MainHeart() {
  const ref = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => buildHeartGeo(0.30, 1 / 50), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.rotation.y = t * 0.38
    ref.current.rotation.x = Math.sin(t * 0.26) * 0.10
  })

  return (
    <Float speed={1.4} floatIntensity={0.45} rotationIntensity={0.06}>
      <mesh ref={ref} geometry={geo} castShadow scale={1.35}>
        <MeshDistortMaterial
          color="#f43f5e"
          metalness={0.65}
          roughness={0.05}
          distort={0.06}
          speed={2.0}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
    </Float>
  )
}

// ── Orbiting smaller hearts ────────────────────────────────
const ORBIT_COLORS = ['#f43f5e', '#ec4899', '#a855f7', '#db2777']

function OrbitHeart({ idx }: { idx: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => buildHeartGeo(0.18, 1 / 50), [])
  const startAngle = (idx / 4) * Math.PI * 2

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    const angle = t * 0.48 + startAngle
    const rx = 2.7
    const rz = 1.8  // elliptical orbit (perspective feel)
    ref.current.position.set(
      Math.cos(angle) * rx,
      Math.sin(t * 0.38 + idx * 1.1) * 0.55,
      Math.sin(angle) * rz,
    )
    ref.current.rotation.y = t * 1.1 + startAngle
    ref.current.rotation.z = Math.sin(t * 0.45 + idx) * 0.25
  })

  return (
    <mesh ref={ref} geometry={geo} scale={0.44}>
      <meshPhysicalMaterial
        color={ORBIT_COLORS[idx]}
        metalness={0.6}
        roughness={0.08}
        clearcoat={0.9}
        clearcoatRoughness={0.06}
      />
    </mesh>
  )
}

// ── Animated lights (changing reflections every frame) ────
function DynamicLights() {
  const l1 = useRef<THREE.PointLight>(null)
  const l2 = useRef<THREE.PointLight>(null)
  const l3 = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (l1.current) l1.current.position.set(Math.cos(t * 0.70) * 5,  Math.sin(t * 0.45) * 3,  3.5)
    if (l2.current) l2.current.position.set(Math.cos(t * 0.50 + 2) * 5, Math.sin(t * 0.35 + 1) * 3, -2.5)
    if (l3.current) l3.current.position.set(Math.cos(t * 0.60 + 4) * 3, -3, Math.sin(t * 0.55) * 3)
  })

  return (
    <>
      <ambientLight intensity={0.42} />
      <pointLight ref={l1} color="#fda4af" intensity={12} />
      <pointLight ref={l2} color="#c084fc" intensity={9}  />
      <pointLight ref={l3} color="#f9a8d4" intensity={7}  />
      <pointLight position={[0, 5, 2]}  color="#ffffff"   intensity={4}  />
    </>
  )
}

// ── Full scene ─────────────────────────────────────────────
function Scene() {
  return (
    <>
      <DynamicLights />
      <MainHeart />
      {[0, 1, 2, 3].map(i => <OrbitHeart key={i} idx={i} />)}
      <Sparkles count={130} scale={7} size={2.0} speed={0.22} color="#fda4af" opacity={0.85} />
      <Sparkles count={55}  scale={5} size={1.4} speed={0.14} color="#c084fc" opacity={0.65} />
    </>
  )
}

export default function FinalHeart3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 6.5], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  )
}
