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

interface ExperienceProps {
  color: string;
}

function Experience({ color }: ExperienceProps) {
  const tiltAngle = (-1.0 * (20 * Math.PI)) / 180; // Convert 20 degrees to radians
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005; // Adjust the rotation speed as needed
    }
  });

  return (
    <>
      <group ref={groupRef} rotation={[0, 0, tiltAngle]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[3.0, 24, 24]} />
          <meshPhongMaterial
            wireframe
            color={"white"}
            emissive={"#807f7f"}
            emissiveIntensity={1}
            shininess={100} // Adjust shininess for smoother reflections
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>
    </>
  );
}

function App() {
  const { x, y, z, color } = {
    x: { value: -1.7, min: -10, max: 10, step: 0.1 },
    y: { value: -1.1, min: -10, max: 10, step: 0.1 },
    z: { value: 3.9, min: -10, max: 10, step: 0.1 },
    color: { value: "#c9c9c9" }, // Add color control
  };

  return (
    <>
      <div className="overlay">
        <h1>Rowan Meyer</h1>
        <h2>Software Engineer</h2>
        <p>About</p>
        <p>Tools</p>
        <p>Projects</p>
      </div>
      <Canvas id="canvas">
        <fog attach="fog" args={["black", 2, 9.0]} />
        <pointLight
          position={[x.value, y.value, z.value]}
          color="hotpink"
          intensity={12}
        />
        <pointLight
          position={[-x.value, -y.value, z.value]}
          color="hotpink"
          intensity={12}
        />

        <Experience color={"#807f7f"} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            height={300}
            intensity={1.5}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
