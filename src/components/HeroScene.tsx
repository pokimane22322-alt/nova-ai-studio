import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';

// Define the blocks that form the "N" letter
// Each block is a rounded box positioned to form the letter N
const N_BLOCKS = [
  // Left vertical bar (bottom to top)
  { pos: [-1.8, -1.5, 0], size: [0.7, 0.7, 0.5] },
  { pos: [-1.8, -0.6, 0], size: [0.7, 0.7, 0.5] },
  { pos: [-1.8, 0.3, 0], size: [0.7, 0.7, 0.5] },
  { pos: [-1.8, 1.2, 0], size: [0.7, 0.7, 0.5] },
  // Diagonal (bottom-left to top-right)
  { pos: [-1.1, -0.9, 0], size: [0.7, 0.7, 0.5] },
  { pos: [-0.3, -0.1, 0], size: [0.7, 0.7, 0.5] },
  { pos: [0.5, 0.7, 0], size: [0.7, 0.7, 0.5] },
  // Right vertical bar (bottom to top)
  { pos: [1.3, -1.5, 0], size: [0.7, 0.7, 0.5] },
  { pos: [1.3, -0.6, 0], size: [0.7, 0.7, 0.5] },
  { pos: [1.3, 0.3, 0], size: [0.7, 0.7, 0.5] },
  { pos: [1.3, 1.2, 0], size: [0.7, 0.7, 0.5] },
];

interface BlockProps {
  targetPos: [number, number, number];
  size: [number, number, number];
  index: number;
  scrollProgress: number;
}

function Block({ targetPos, size, index, scrollProgress }: BlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  // Random scattered position for disassembled state
  const scatterPos = useMemo(() => {
    const angle = (index / N_BLOCKS.length) * Math.PI * 2 + index * 0.5;
    const radius = 4 + Math.random() * 3;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius + (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 5 - 2
    );
  }, [index]);

  const scatterRot = useMemo(() => new THREE.Euler(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  ), []);

  const target = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Progress 0 = assembled, 1 = scattered
    const t = Math.min(Math.max(scrollProgress * 1.5, 0), 1);
    const eased = t * t * (3 - 2 * t); // smoothstep

    // Interpolate position
    meshRef.current.position.lerpVectors(target, scatterPos, eased);

    // Interpolate rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(0, scatterRot.x, eased);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(0, scatterRot.y, eased);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(0, scatterRot.z, eased);

    // Glow intensity based on scroll
    if (edgesRef.current) {
      const mat = edgesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.3 + (1 - eased) * 0.5;
    }
  });

  const geometry = useMemo(() => {
    return new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1);
  }, [size]);

  const edgesGeom = useMemo(() => {
    return new THREE.EdgesGeometry(geometry);
  }, [geometry]);

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#6B00FF"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
          emissive="#3300AA"
          emissiveIntensity={0.15}
        />
        <lineSegments ref={edgesRef} geometry={edgesGeom}>
          <lineBasicMaterial color="#00F0FF" transparent opacity={0.6} />
        </lineSegments>
      </mesh>
    </group>
  );
}

function NLogo({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle floating rotation when assembled
    const t = Math.min(Math.max(scrollProgress * 1.5, 0), 1);
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 * (1 - t);
    groupRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05 * (1 - t);
  });

  return (
    <group ref={groupRef} rotation={[-0.3, 0.2, 0]} position={[0.5, 0.3, 0]}>
      {N_BLOCKS.map((block, i) => (
        <Block
          key={i}
          targetPos={block.pos as [number, number, number]}
          size={block.size as [number, number, number]}
          index={i}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 3;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#00F0FF" size={0.03} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#8844FF" />
      <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#00F0FF" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#6B00FF" distance={10} />
      <pointLight position={[3, -2, 1]} intensity={1} color="#00F0FF" distance={8} />
    </>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <SceneLighting />
      <Particles />
      <NLogo scrollProgress={scrollProgress} />
      <Environment preset="night" />
    </>
  );
}

export default function HeroScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <Scene scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
