import React, { Suspense, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import * as THREE from 'three';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, SSAO } from '@react-three/postprocessing';

function Swarm({ count, ...props }) {
  const mesh = useRef();
  const [dummy] = useState(() => new THREE.Object3D());

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -40 + Math.random() * 80;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);
      particle.mx +=
        (state.mouse.x * state.viewport.width - particle.mx) * 0.02;
      particle.my +=
        (state.mouse.y * state.viewport.height - particle.my) * 0.02;
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, count]}
      castShadow
      receiveShadow
      {...props}
    >
      <sphereBufferGeometry args={[1, 32, 32]} />
      <meshStandardMaterial roughness={0} color="#f0f0f0" />
    </instancedMesh>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`🔥 ${siteConfig.title} 🔥`}
      description="Declarative THREE.js in Angular"
    >
      <Canvas
        shadows
        gl={{ alpha: false, antialias: false }}
        camera={{ fov: 75, position: [0, 0, 50], near: 10, far: 150 }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <fog attach="fog" args={['black', 60, 100]} />
        <ambientLight intensity={1.5} />
        <pointLight position={[100, 10, -50]} intensity={20} castShadow />
        <pointLight
          position={[-100, -100, -100]}
          intensity={10}
          color="black"
        />
        <Swarm count={150} position={[0, 10, 0]} />
        <ContactShadows
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -30, 0]}
          opacity={0.6}
          width={130}
          height={130}
          blur={1}
          far={40}
        />
        <EffectComposer multisampling={0}>
          <SSAO
            samples={31}
            radius={10}
            intensity={30}
            luminanceInfluence={0.1}
            color="black"
          />
        </EffectComposer>
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </Layout>
  );
}
