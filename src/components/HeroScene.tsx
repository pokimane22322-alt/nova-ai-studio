import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Split a single BufferGeometry into connected components (islands).
 * Each island becomes its own geometry that can animate independently.
 */
function splitIntoIslands(geometry: THREE.BufferGeometry): THREE.BufferGeometry[] {
  const posAttr = geometry.getAttribute('position');
  const normAttr = geometry.getAttribute('normal');
  const index = geometry.getIndex();
  if (!index) return [geometry];

  const vertCount = posAttr.count;
  const indices = index.array;
  const triCount = indices.length / 3;

  // Union-Find
  const parent = new Int32Array(vertCount);
  const rank = new Uint8Array(vertCount);
  for (let i = 0; i < vertCount; i++) parent[i] = i;

  function find(x: number): number {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(a: number, b: number) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
  }

  // Merge vertices that share a position (within epsilon) to connect pieces
  const posMap = new Map<string, number>();
  const canonical = new Int32Array(vertCount);
  for (let i = 0; i < vertCount; i++) {
    const key = `${(posAttr.getX(i) * 1000) | 0},${(posAttr.getY(i) * 1000) | 0},${(posAttr.getZ(i) * 1000) | 0}`;
    if (posMap.has(key)) {
      canonical[i] = posMap.get(key)!;
      union(i, canonical[i]);
    } else {
      posMap.set(key, i);
      canonical[i] = i;
    }
  }

  // Union triangle vertices
  for (let t = 0; t < triCount; t++) {
    const a = indices[t * 3], b = indices[t * 3 + 1], c = indices[t * 3 + 2];
    union(a, b);
    union(b, c);
  }

  // Group triangles by island
  const islandTris = new Map<number, number[]>();
  for (let t = 0; t < triCount; t++) {
    const root = find(indices[t * 3]);
    if (!islandTris.has(root)) islandTris.set(root, []);
    islandTris.get(root)!.push(t);
  }

  // Build a geometry per island
  const results: THREE.BufferGeometry[] = [];
  for (const [, tris] of islandTris) {
    if (tris.length < 2) continue; // skip degenerate

    // Remap vertices
    const vertRemap = new Map<number, number>();
    const newPositions: number[] = [];
    const newNormals: number[] = [];
    const newIndices: number[] = [];

    for (const t of tris) {
      for (let j = 0; j < 3; j++) {
        const vi = indices[t * 3 + j];
        if (!vertRemap.has(vi)) {
          const ni = newPositions.length / 3;
          vertRemap.set(vi, ni);
          newPositions.push(posAttr.getX(vi), posAttr.getY(vi), posAttr.getZ(vi));
          if (normAttr) newNormals.push(normAttr.getX(vi), normAttr.getY(vi), normAttr.getZ(vi));
        }
        newIndices.push(vertRemap.get(vi)!);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
    if (newNormals.length) geo.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
    geo.setIndex(newIndices);
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

function LogoBlocks({ scrollProgress }: { scrollProgress: number }) {
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
        // Center each island geometry on its own centroid
        geo.computeBoundingBox();
        const center = new THREE.Vector3();
        geo.boundingBox!.getCenter(center);

        // Apply any parent transforms
        center.applyMatrix4(mesh.matrixWorld);

        // Translate geometry so it's centered at origin (we'll position with the mesh)
        const positions = geo.getAttribute('position');
        for (let v = 0; v < positions.count; v++) {
          positions.setXYZ(
            v,
            positions.getX(v) - (geo.boundingBox!.max.x + geo.boundingBox!.min.x) / 2,
            positions.getY(v) - (geo.boundingBox!.max.y + geo.boundingBox!.min.y) / 2,
            positions.getZ(v) - (geo.boundingBox!.max.z + geo.boundingBox!.min.z) / 2,
          );
        }
        positions.needsUpdate = true;

        const angle = (i / Math.max(islands.length, 1)) * Math.PI * 2 + i * 0.7;
        const radius = 5 + Math.random() * 4;

        allBlocks.push({
          geometry: geo,
          center,
          scatterPos: new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius + (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 6 - 3
          ),
          scatterRot: new THREE.Euler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          ),
        });
      });
    });
    setBlocks(allBlocks);
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = Math.min(Math.max(scrollProgress * 1.5, 0), 1);
    const eased = t * t * (3 - 2 * t);

    groupRef.current.rotation.y = 0.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1 * (1 - eased);
    groupRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05 * (1 - eased);

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh || !blocks[i]) return;
      const b = blocks[i];
      mesh.position.lerpVectors(b.center, b.scatterPos, eased);
      mesh.rotation.x = THREE.MathUtils.lerp(0, b.scatterRot.x, eased);
      mesh.rotation.y = THREE.MathUtils.lerp(0, b.scatterRot.y, eased);
      mesh.rotation.z = THREE.MathUtils.lerp(0, b.scatterRot.z, eased);
    });
  });

  return (
    <group ref={groupRef} position={[0.5, 0, 0]} scale={1.2}>
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
            metalness={0.9}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            emissive="#3300AA"
            emissiveIntensity={0.15}
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
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#8844FF" />
      <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#00F0FF" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#6B00FF" distance={10} />
      <pointLight position={[3, -2, 1]} intensity={1} color="#00F0FF" distance={8} />
      <Particles />
      <LogoBlocks scrollProgress={scrollProgress} />
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
