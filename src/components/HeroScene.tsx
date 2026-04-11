import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Split a BufferGeometry into connected component islands via union-find.
 */
function splitIntoIslands(geometry: THREE.BufferGeometry): THREE.BufferGeometry[] {
  const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
  const normAttr = geometry.getAttribute('normal') as THREE.BufferAttribute | null;
  const index = geometry.getIndex();
  if (!index) return [geometry];

  const vertCount = posAttr.count;
  const indices = index.array;
  const triCount = indices.length / 3;

  // Union-Find
  const parent = new Int32Array(vertCount);
  const rnk = new Uint8Array(vertCount);
  for (let i = 0; i < vertCount; i++) parent[i] = i;
  function find(x: number): number {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(a: number, b: number) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return;
    if (rnk[ra] < rnk[rb]) parent[ra] = rb;
    else if (rnk[ra] > rnk[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rnk[ra]++; }
  }

  // Merge coincident vertices via spatial hash
  const posMap = new Map<string, number>();
  for (let i = 0; i < vertCount; i++) {
    const key = `${Math.round(posAttr.getX(i) * 500)},${Math.round(posAttr.getY(i) * 500)},${Math.round(posAttr.getZ(i) * 500)}`;
    if (posMap.has(key)) union(i, posMap.get(key)!);
    else posMap.set(key, i);
  }

  // Union triangle edges
  for (let t = 0; t < triCount; t++) {
    const a = indices[t * 3], b = indices[t * 3 + 1], c = indices[t * 3 + 2];
    union(a, b); union(b, c);
  }

  // Group triangles by island root
  const islandTris = new Map<number, number[]>();
  for (let t = 0; t < triCount; t++) {
    const root = find(indices[t * 3]);
    if (!islandTris.has(root)) islandTris.set(root, []);
    islandTris.get(root)!.push(t);
  }

  // Build geometry per island
  const results: THREE.BufferGeometry[] = [];
  for (const [, tris] of islandTris) {
    if (tris.length < 4) continue;

    const vertRemap = new Map<number, number>();
    const newPos: number[] = [];
    const newNorm: number[] = [];
    const newIdx: number[] = [];

    for (const t of tris) {
      for (let j = 0; j < 3; j++) {
        const vi = indices[t * 3 + j];
        if (!vertRemap.has(vi)) {
          const ni = newPos.length / 3;
          vertRemap.set(vi, ni);
          newPos.push(posAttr.getX(vi), posAttr.getY(vi), posAttr.getZ(vi));
          if (normAttr) newNorm.push(normAttr.getX(vi), normAttr.getY(vi), normAttr.getZ(vi));
        }
        newIdx.push(vertRemap.get(vi)!);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(newPos, 3));
    if (newNorm.length) geo.setAttribute('normal', new THREE.Float32BufferAttribute(newNorm, 3));
    geo.setIndex(newIdx);
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    results.push(geo);
  }

  return results;
}

interface BlockData {
  geometry: THREE.BufferGeometry;
  center: THREE.Vector3;
  scatterPos: THREE.Vector3;
  scatterRot: THREE.Euler;
}

function LogoModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF('/models/logo.glb');
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  useEffect(() => {
    const allBlocks: BlockData[] = [];

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const islands = splitIntoIslands(mesh.geometry);

      islands.forEach((geo, i) => {
        // Find the centroid of this island
        geo.computeBoundingBox();
        const center = new THREE.Vector3();
        geo.boundingBox!.getCenter(center);

        // Recenter geometry at its own origin
        const offset = center.clone();
        const positions = geo.getAttribute('position') as THREE.BufferAttribute;
        for (let v = 0; v < positions.count; v++) {
          positions.setXYZ(
            v,
            positions.getX(v) - offset.x,
            positions.getY(v) - offset.y,
            positions.getZ(v) - offset.z,
          );
        }
        positions.needsUpdate = true;
        geo.computeBoundingBox();
        geo.computeBoundingSphere();

        // Scatter destination
        const angle = (i / Math.max(islands.length, 1)) * Math.PI * 2 + i * 1.2;
        const radius = 3.5 + Math.random() * 2.5;
        const scatterPos = new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.8 + (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 4 - 2,
        );
        const scatterRot = new THREE.Euler(
          (Math.random() - 0.5) * Math.PI * 0.8,
          (Math.random() - 0.5) * Math.PI * 0.8,
          (Math.random() - 0.5) * Math.PI * 0.5,
        );

        allBlocks.push({ geometry: geo, center: offset, scatterPos, scatterRot });
      });
    });

    setBlocks(allBlocks);
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = THREE.MathUtils.clamp(scrollProgress * 1.4, 0, 1);
    const eased = t * t * (3 - 2 * t);
    const settle = 1 - eased;

    // Subtle idle sway when assembled
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.025 * settle;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.015 * settle;

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh || !blocks[i]) return;
      const b = blocks[i];

      // Position: lerp between assembled center and scattered
      mesh.position.lerpVectors(b.center, b.scatterPos, eased);
      // Add subtle float when assembled
      mesh.position.y += Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.02 * settle;

      // Rotation: 0 when assembled, scattered rotation when disassembled
      mesh.rotation.x = THREE.MathUtils.lerp(0, b.scatterRot.x, eased);
      mesh.rotation.y = THREE.MathUtils.lerp(0, b.scatterRot.y, eased);
      mesh.rotation.z = THREE.MathUtils.lerp(0, b.scatterRot.z, eased);
    });
  });

  return (
    <group
      ref={groupRef}
      // Model is in Y-Z plane (X is thin). Rotate 90° around Y so the face points at camera (+Z).
      // Also center vertically (model Y goes 0→1.72, so shift down by ~0.86).
      position={[0.5, -0.1, 0]}
      rotation={[0, Math.PI / 2, 0]}
      scale={3}
    >
      {blocks.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
          geometry={b.geometry}
          position={b.center}
          castShadow
          receiveShadow
        >
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
        </mesh>
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
