import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Three.js docs canonical heart shape, scaled down by /50
function createHeartShape() {
  const s = new THREE.Shape()
  s.moveTo(25, 25)
  s.bezierCurveTo(25, 25, 20,  0,   0,   0)
  s.bezierCurveTo(-30, 0,  -30, 35,  -30, 35)
  s.bezierCurveTo(-30, 55, -10, 77,  25,  95)
  s.bezierCurveTo(60,  77,  80,  55,  80,  35)
  s.bezierCurveTo(80,  35,  80,  0,   50,  0)
  s.bezierCurveTo(35,  0,   25,  25,  25,  25)
  return s
}

function HeartMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const shape = createHeartShape()
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 14,
      bevelEnabled: true,
      bevelSegments: 12,
      bevelSize: 5,
      bevelThickness: 5,
      curveSegments: 32,
    })
    geo.center()
    geo.scale(1 / 50, 1 / 50, 1 / 50)
    geo.rotateX(Math.PI) // face camera
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    meshRef.current.rotation.y = t * 0.42
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.12
  })

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <MeshDistortMaterial
        color="#f43f5e"
        metalness={0.6}
        roughness={0.08}
        distort={0.07}
        speed={2.2}
        clearcoat={1}
        clearcoatRoughness={0.05}
      />
    </mesh>
  )
}

function Rings() {
  const r1 = useRef<THREE.Mesh>(null)
  const r2 = useRef<THREE.Mesh>(null)
  const r3 = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (r1.current) { r1.current.rotation.z = t * 0.55; r1.current.rotation.x = 0.9 }
    if (r2.current) { r2.current.rotation.y = t * 0.40; r2.current.rotation.x = 1.3 }
    if (r3.current) { r3.current.rotation.z = -t * 0.30; r3.current.rotation.y = t * 0.22 }
  })

  return (
    <>
      <mesh ref={r1}>
        <torusGeometry args={[1.6, 0.013, 16, 140]} />
        <meshStandardMaterial color="#f9a8d4" metalness={0.8} roughness={0.1} transparent opacity={0.4} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[1.95, 0.010, 16, 140]} />
        <meshStandardMaterial color="#c084fc" metalness={0.8} roughness={0.1} transparent opacity={0.32} />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[2.32, 0.008, 16, 140]} />
        <meshStandardMaterial color="#7dd3fc" metalness={0.8} roughness={0.1} transparent opacity={0.25} />
      </mesh>
    </>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[ 4,  4, 5]} color="#fda4af" intensity={12} />
      <pointLight position={[-4,  3,-3]} color="#c084fc" intensity={8}  />
      <pointLight position={[ 0, -4, 4]} color="#38bdf8" intensity={6}  />
      <pointLight position={[ 3, -2, 4]} color="#f9a8d4" intensity={5}  />

      <Float speed={1.6} rotationIntensity={0.10} floatIntensity={0.5}>
        <HeartMesh />
      </Float>

      <Rings />

      <Sparkles count={100} scale={5.5} size={1.8} speed={0.28} color="#fda4af" opacity={0.8} />
      <Sparkles count={45}  scale={4.0} size={1.2} speed={0.18} color="#c084fc" opacity={0.65} />
    </>
  )
}

export default function HeroHeart3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 46 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  )
}
