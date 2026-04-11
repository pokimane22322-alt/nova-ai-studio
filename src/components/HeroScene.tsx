import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense, useEffect } from 'react';
import * as THREE from 'three';

function LogoModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF('/models/logo.glb');
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<
    { mesh: THREE.Mesh; originalPos: THREE.Vector3; scatterPos: THREE.Vector3; scatterRot: THREE.Euler }[]
  >([]);

  useEffect(() => {
    const meshes: typeof meshesRef.current = [];
    let index = 0;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Apply purple metallic material
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#6B00FF'),
          metalness: 0.9,
          roughness: 0.15,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          envMapIntensity: 2,
          emissive: new THREE.Color('#3300AA'),
          emissiveIntensity: 0.15,
        });

        // Add glowing edges
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const edgeMesh = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: '#00F0FF', transparent: true, opacity: 0.6 })
        );
        mesh.add(edgeMesh);

        const originalPos = mesh.position.clone();
        const angle = (index / 15) * Math.PI * 2 + index * 0.7;
        const radius = 5 + Math.random() * 4;
        const scatterPos = new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 6 - 3
        );
        const scatterRot = new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

        meshes.push({ mesh, originalPos, scatterPos, scatterRot });
        index++;
      }
    });
    meshesRef.current = meshes;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = Math.min(Math.max(scrollProgress * 1.5, 0), 1);
    const eased = t * t * (3 - 2 * t);

    // Gentle floating when assembled
    groupRef.current.rotation.y = 0.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1 * (1 - eased);
    groupRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05 * (1 - eased);

    // Animate each mesh piece
    for (const { mesh, originalPos, scatterPos, scatterRot } of meshesRef.current) {
      mesh.position.lerpVectors(originalPos, scatterPos, eased);
      mesh.rotation.x = THREE.MathUtils.lerp(0, scatterRot.x, eased);
      mesh.rotation.y = THREE.MathUtils.lerp(0, scatterRot.y, eased);
      mesh.rotation.z = THREE.MathUtils.lerp(0, scatterRot.z, eased);
    }
  });

  return (
    <group ref={groupRef} position={[0.5, 0, 0]} scale={1.2}>
      <primitive object={scene} />
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
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#8844FF" />
      <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#00F0FF" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#6B00FF" distance={10} />
      <pointLight position={[3, -2, 1]} intensity={1} color="#00F0FF" distance={8} />
      <Particles />
      <LogoModel scrollProgress={scrollProgress} />
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

useGLTF.preload('/models/logo.glb');
