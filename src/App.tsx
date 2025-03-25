import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import {
  OrbitControls,
  Stats,
  axesHelper,
  shaderMaterial,
} from "@react-three/drei";
import { Mesh, Group, AmbientLight } from "three";
import { Leva, useControls } from "leva";
import smokeURL from "./assets/smoke_1_black.png";
import "./App.css";

interface ExperienceProps {
  color: string;
  emissive_color: string;
  emissive_intensity: number;
  shininess: number;
  opacity: number;
}

function SmokeEffect() {
  const smokeTexture = useLoader(TextureLoader, smokeURL); // Load the smoke texture
  const smokeRefs = useRef<Mesh[]>([]); // Array of references for smoke planes

  // Create an array of smoke planes with random initial positions and rotations
  const smokePlanes = Array.from({ length: 50 }, (_, i) => ({
    map: smokeTexture,
    transparent: true,
    opacity: 1.0,
    id: i,
    position: [
      Math.random() * 20 - 20,
      Math.random() * 15 - 10.5,
      Math.random() * -5 - 5,
    ],
    rotation: Math.random() * Math.PI * 2,
  }));

  // Animate the smoke planes to move from right to left
  useFrame(() => {
    smokeRefs.current.forEach((smoke, index) => {
      if (smoke) {
        smoke.position.x -= 0.01; // Move left
        smoke.rotation.z -= 0.001; // Rotate
        if (smoke.position.x < -20) {
          // Reset position when off-screen
          smoke.position.x = 20;
          smoke.position.y = Math.random() * 5 - 2.5; // Randomize vertical position
          smoke.rotation.z = Math.random() * Math.PI * 2; // Randomize rotation
        }
      }
    });
  });

  return (
    <>
      {smokePlanes.map((plane, index) => (
        <mesh
          key={plane.id}
          ref={(el) => (smokeRefs.current[index] = el!)} // Store references
          position={plane.position as [number, number, number]}
          rotation={[0, 0, plane.rotation]}
        >
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial
            map={smokeTexture}
            transparent={true}
            opacity={0.5}
          />
        </mesh>
      ))}
    </>
  );
}

function Experience({
  color,
  emissive_color,
  emissive_intensity,
  shininess,
  opacity,
}: ExperienceProps) {
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
            color={color}
            emissive={emissive_color}
            emissiveIntensity={emissive_intensity}
            shininess={shininess} // Adjust shininess for smoother reflections
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
    </>
  );
}

function App() {
  const defaultSettings = {
    x: -1.7,
    y: -1.1,
    z: 3.9,
    color: "#c9c9c9",
    color_fog: "#000000",
    color_emission: "#807f7f",
    emission_intensity: 0.5,
    color_light: "#ff69b4",
    color_light_intensity: 12,
    color_wireframe: "white",
    shininess: 100,
    opacity: 1.0,
    font_color: "#ffffff", // Default font color
    panel_color: "#00000099", // Default panel color
  };

  const savedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
  const initialSettings = { ...defaultSettings, ...savedSettings };

  const {
    x,
    y,
    z,
    color,
    color_fog,
    color_emission,
    emission_intensity,
    ambient_color,
    ambient_intensity,
    color_light,
    color_light_intensity,
    color_wireframe,
    shininess,
    opacity,
    font_color,
    panel_color,
  } = useControls({
    x: { value: initialSettings.x, min: -10, max: 10, step: 0.1 },
    y: { value: initialSettings.y, min: -10, max: 10, step: 0.1 },
    z: { value: initialSettings.z, min: -10, max: 10, step: 0.1 },
    color: { value: initialSettings.color },
    color_fog: { value: initialSettings.color_fog },
    color_emission: { value: initialSettings.color_emission },
    emission_intensity: {
      value: initialSettings.emission_intensity,
      min: 0,
      max: 20,
      step: 0.1,
    },
    ambient_color: { value: "#ffffff" },
    ambient_intensity: { value: 0.5, min: 0, max: 20, step: 0.1 },
    color_light: { value: initialSettings.color_light },
    color_light_intensity: {
      value: initialSettings.color_light_intensity,
      min: 0,
      max: 100,
      step: 1,
    },
    color_wireframe: { value: initialSettings.color_wireframe },
    shininess: { value: initialSettings.shininess, min: 0, max: 100, step: 1 },
    opacity: { value: initialSettings.opacity, min: 0, max: 1, step: 0.1 },
    font_color: { value: initialSettings.font_color }, // Add font color control
    panel_color: { value: initialSettings.panel_color }, // Add panel color control
  });

  useEffect(() => {
    const settings = {
      x,
      y,
      z,
      color,
      color_fog,
      color_emission,
      emission_intensity,
      ambient_color,
      ambient_intensity,
      color_light,
      color_light_intensity,
      color_wireframe,
      shininess,
      opacity,
      font_color,
      panel_color,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [
    x,
    y,
    z,
    color,
    color_fog,
    color_emission,
    emission_intensity,
    ambient_color,
    ambient_intensity,
    color_light,
    color_light_intensity,
    color_wireframe,
    shininess,
    opacity,
    font_color,
    panel_color,
  ]);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.style.backgroundColor = color_fog;
    }
  }, [color_fog]);

  return (
    <>
      <div
        className="overlay"
        style={{ color: font_color }} // Dynamically set font color
      >
        <h1>Rowan Meyer</h1>
        <h2>Software Engineer</h2>
        <p>About</p>
        <p>Tools</p>
        <p>Projects</p>
        <p>CV</p>
      </div>
      <div
        className="content-overlay"
        style={{ color: font_color, backgroundColor: panel_color }} // Dynamically set font color
      >
        <p>
          I am a software engineer who specializes in geospatial data and
          visualization. I work with mission-driven organizations develop their
          infrastructure and share their data with the world.
        </p>
      </div>
      <Canvas id="canvas">
        <Suspense fallback={null}>
          <SmokeEffect />
        </Suspense>
        <fog attach="fog" args={[color_fog, 2, 9.0]} />
        <ambientLight color={ambient_color} intensity={ambient_intensity} />
        <pointLight
          position={[x, y, z]}
          color={color_light}
          intensity={color_light_intensity}
        />
        <pointLight
          position={[-x, -y, z]}
          color={color_light}
          intensity={color_light_intensity}
        />

        <Experience
          color={color}
          emissive_color={color_emission}
          emissive_intensity={emission_intensity}
          shininess={shininess}
          opacity={0.9}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            height={400}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
