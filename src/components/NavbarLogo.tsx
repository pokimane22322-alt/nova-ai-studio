import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';

function MiniLogo() {
  const { scene } = useGLTF('/models/logo.glb');
  const groupRef = useRef<THREE.Group>(null);
  const clockRef = useRef(0);
  const [phase, setPhase] = useState<'spin' | 'idle'>('spin');
  const spinStartRef = useRef(0);

  useEffect(() => {
    // Apply material to all meshes
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0.3,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.5,
          emissive: '#ffffff',
          emissiveIntensity: 0.3,
        });
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    clockRef.current += delta;

    const spinDuration = 2; // seconds for full 360
    const idleDuration = 4; // seconds of gentle sway

    if (phase === 'spin') {
      const t = Math.min(clockRef.current / spinDuration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      groupRef.current.rotation.y = eased * (Math.PI * 2 + Math.PI / 2);
      // Target rest rotation matching reference image
      groupRef.current.rotation.x = -0.3 * eased;
      groupRef.current.rotation.z = 0.05 * eased;

      if (t >= 1) {
        setPhase('idle');
        clockRef.current = 0;
        spinStartRef.current = state.clock.elapsedTime;
      }
    } else {
      // Gentle wave/sway at rest position
      const elapsed = state.clock.elapsedTime - spinStartRef.current;
      groupRef.current.rotation.y = Math.PI * 2 + Math.PI / 2 + Math.sin(elapsed * 0.8) * 0.12;
      groupRef.current.rotation.x = -0.3 + Math.sin(elapsed * 0.6) * 0.05;
      groupRef.current.rotation.z = 0.05 + Math.cos(elapsed * 0.7) * 0.03;

      // After idle duration, spin again
      if (elapsed > idleDuration) {
        setPhase('spin');
        clockRef.current = 0;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.9}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export default function NavbarLogo() {
  return (
    <div className="w-12 h-12 mt-2">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 3, 3]} intensity={1} color="#8844FF" />
          <pointLight position={[0, 0, 2]} intensity={1.5} color="#6B00FF" distance={8} />
          <MiniLogo />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
