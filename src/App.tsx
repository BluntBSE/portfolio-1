import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import { OrbitControls, Stats, axesHelper } from "@react-three/drei";
import { Mesh, Group } from "three";
import { Leva, useControls } from "leva";
import "./App.css";

function Experience() {
  const tiltAngle = (-1.0 * (20 * Math.PI)) / 180; // Convert 20 degrees to radians
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001; // Adjust the rotation speed as needed
    }
  });

  return (
    <>
      <group ref={groupRef} rotation={[0, 0, tiltAngle]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[3.0, 24, 24]} />
          <meshStandardMaterial
            wireframe
            color={"darkgray"}
            emissive={"gray"}
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </>
  );
}

function App() {
  const { x, y, z } = useControls({
    x: { value: 0, min: -10, max: 10, step: 0.1 },
    y: { value: 3, min: -10, max: 10, step: 0.1 },
    z: { value: 3, min: -10, max: 10, step: 0.1 },
  });
  return (
    <>
      <Leva />

      <Canvas id="canvas">
        <fog attach="fog" args={["black", 2, 9.0]} />
        <pointLight position={[x, y, z]} color="red" intensity={6} />

        <Experience />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            height={300}
            intensity={1.5}
          />
        </EffectComposer>
        <Stats />
      </Canvas>
    </>
  );
}

export default App;
