import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

const N_BLOCKS = [
  { pos: [-1.85, -1.5, 0], size: [0.72, 0.72, 0.56] },
  { pos: [-1.85, -0.6, 0], size: [0.72, 0.72, 0.56] },
  { pos: [-1.85, 0.3, 0], size: [0.72, 0.72, 0.56] },
  { pos: [-1.85, 1.2, 0], size: [0.72, 0.72, 0.56] },
  { pos: [-1.1, -0.9, 0], size: [0.72, 0.72, 0.56] },
  { pos: [-0.3, -0.1, 0], size: [0.72, 0.72, 0.56] },
  { pos: [0.5, 0.7, 0], size: [0.72, 0.72, 0.56] },
  { pos: [1.25, -1.5, 0], size: [0.72, 0.72, 0.56] },
  { pos: [1.25, -0.6, 0], size: [0.72, 0.72, 0.56] },
  { pos: [1.25, 0.3, 0], size: [0.72, 0.72, 0.56] },
  { pos: [1.25, 1.2, 0], size: [0.72, 0.72, 0.56] },
] as const;

interface BlockProps {
  targetPos: [number, number, number];
  size: [number, number, number];
  index: number;
  scrollProgress: number;
}

function Block({ targetPos, size, index, scrollProgress }: BlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  const assembledPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const scatterPos = useMemo(() => {
    const angle = (index / N_BLOCKS.length) * Math.PI * 2 + index * 0.45;
    const radius = 4.2 + (index % 3) * 0.7;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.75 + (index % 4 - 1.5) * 0.8,
      -1.4 - (index % 3) * 0.4,
    );
  }, [index]);

  const scatterRot = useMemo(
    () => new THREE.Euler(
      (index % 2 === 0 ? 1 : -1) * 0.7,
      (index % 3 - 1) * 0.95,
      (index % 4 - 1.5) * 0.45,
    ),
    [index],
  );

  const geometry = useMemo(() => new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1), [size]);
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const disassemble = THREE.MathUtils.clamp(scrollProgress * 1.35, 0, 1);
    const eased = disassemble * disassemble * (3 - 2 * disassemble);
    const idleY = Math.sin(state.clock.elapsedTime * 0.9 + index) * 0.03 * (1 - eased);
    const idleZ = Math.sin(state.clock.elapsedTime * 0.6 + index * 0.7) * 0.015 * (1 - eased);

    meshRef.current.position.lerpVectors(assembledPos, scatterPos, eased);
    meshRef.current.position.y += idleY;
    meshRef.current.position.z += idleZ;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(0, scatterRot.x, eased);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(0, scatterRot.y, eased);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(0, scatterRot.z, eased);

    if (edgesRef.current) {
      const material = edgesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.55 + (1 - eased) * 0.25;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#6B00FF"
        metalness={0.92}
        roughness={0.14}
        clearcoat={1}
        clearcoatRoughness={0.08}
        envMapIntensity={2.2}
        emissive="#2A0070"
        emissiveIntensity={0.18}
      />
      <lineSegments ref={edgesRef} geometry={edgeGeometry}>
        <lineBasicMaterial color="#00F0FF" transparent opacity={0.8} />
      </lineSegments>
    </mesh>
  );
}

function NLogo({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const disassemble = THREE.MathUtils.clamp(scrollProgress * 1.35, 0, 1);
    const settle = 1 - disassemble;

    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.025 * settle;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.04 * settle;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.015 * settle;
  });

  return (
    <group ref={groupRef} position={[0.55, 0.2, 0]}>
      {N_BLOCKS.map((block, index) => (
        <Block
          key={index}
          targetPos={block.pos as [number, number, number]}
          size={block.size as [number, number, number]}
          index={index}
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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00F0FF" size={0.03} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.24} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#8844FF" />
      <directionalLight position={[-5, 3, 2]} intensity={0.55} color="#00F0FF" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#6B00FF" distance={10} />
      <pointLight position={[3, -2, 1]} intensity={1} color="#00F0FF" distance={8} />
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
