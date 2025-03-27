import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { Mesh, Group } from "three";
import { useControls } from "leva";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import SmokeEffect from "./components/SmokeEffect";
import About from "./components/About";
import Navigation from "./components/Navigation";
import CV from "./components/CV";

import { motion, AnimatePresence } from "framer-motion";

interface ExperienceProps {
  color: string;
  emissive_color: string;
  emissive_intensity: number;
  opacity: number;
}

function Experience({
  color,
  emissive_color,
  emissive_intensity,
  opacity,
}: ExperienceProps) {
  const tiltAngle = (-1.0 * (20 * Math.PI)) / 180; // Convert 20 degrees to radians
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  const [targetTilt, setTargetTilt] = useState({ x: 0, y: 0, z: tiltAngle }); // Target tilt angles
  const currentTilt = useRef({ x: 0, y: 0, z: tiltAngle }); // Current tilt angles

  // Utility function to clamp values
  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  // Utility function for linear interpolation (lerp)
  const lerp = (start: number, end: number, t: number) => {
    return start + (end - start) * t;
  };

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;

    // Map mouse position to tilt angles
    const tiltX = ((clientY / window.innerHeight) * 2 - 1) * 0.2; // Map Y-axis to [-0.2, 0.2]
    const tiltY = ((clientX / window.innerWidth) * 2 - 1) * 0.2; // Map X-axis to [-0.2, 0.2]
    const tiltZ = tiltAngle; // Use a fixed tilt angle

    // Clamp the tilt values and set the target tilt
    setTargetTilt({
      x: clamp(tiltX, -0.2, 0.2),
      y: clamp(tiltY, -0.2, 0.2),
      z: tiltZ,
    });
  };

  useEffect(() => {
    // Add the event listener
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array ensures this runs only once

  useFrame(() => {
    if (meshRef.current) {
      // Smoothly interpolate current tilt toward target tilt
      currentTilt.current.x = lerp(currentTilt.current.x, targetTilt.x, 0.1); // Adjust the 0.1 for smoother or faster easing
      currentTilt.current.y = lerp(currentTilt.current.y, targetTilt.y, 0.1);
      currentTilt.current.z = lerp(currentTilt.current.z, targetTilt.z, 0.1);

      // Apply the interpolated tilt to the group
      groupRef.current!.rotation.x = currentTilt.current.x;
      groupRef.current!.rotation.y = currentTilt.current.y;
      groupRef.current!.rotation.z = currentTilt.current.z;

      // Slowly rotate the orb on the Y-axis for additional effect
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[3.0, 24, 24]} />
        <meshPhongMaterial
          wireframe
          color={color}
          emissive={emissive_color}
          emissiveIntensity={emissive_intensity}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

function App() {
  const defaultSettings = {
    x: -1.7,
    y: -1.1,
    z: 3.9,
    color: "#ffffff",
    color_fog: "#0033ff",
    color_emission: "#ffffff",
    emission_intensity: 0.1,
    color_light: "#f74739",
    color_light_intensity: 38,
    color_wireframe: "#ffffff",
    shininess: 100,
    opacity: 1.0,
    font_color: "#ffffff",
    panel_color: "#000000",
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
    x: { value: initialSettings.x as number, min: -10, max: 10, step: 0.1 },
    y: { value: initialSettings.y as number, min: -10, max: 10, step: 0.1 },
    z: { value: initialSettings.z as number, min: -10, max: 10, step: 0.1 },
    color: { value: initialSettings.color },
    color_fog: { value: initialSettings.color_fog },
    color_emission: { value: initialSettings.color_emission },
    emission_intensity: {
      value: initialSettings.emission_intensity as number,
      min: 0,
      max: 20,
      step: 0.1,
    },
    ambient_color: { value: "#ffffff" },
    ambient_intensity: { value: 0.5, min: 0, max: 20, step: 0.1 },
    color_light: { value: initialSettings.color_light },
    color_light_intensity: {
      value: initialSettings.color_light_intensity as number,
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

  const [currentPanel, setCurrentPanel] = useState("about"); // Track the current panel

  const handleNavigation = (panel: string) => {
    console.log("Hello from handle");
    setCurrentPanel(panel);
  };

  const panelVariants = {
    initial: { y: 0, opacity: 1, zIndex: 10 },
    bounceUp: { y: -50, transition: { type: "spring", stiffness: 300 } },
    slideOut: { y: "-100%", opacity: 0, transition: { duration: 0.5 } },
    slideIn: { y: "100%", opacity: 0, transition: { duration: 0 }, zIndex: 10 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="mobile-bg"></div>
      <Router>
        <Navigation
          font_color="#ffffff"
          panel_color="#ffffff00"
          navcallback={handleNavigation}
        />
        <AnimatePresence mode="wait">
          {currentPanel === "about" && (
            <motion.div
              key="about"
              className="content-overlay"
              style={{
                color: "#ffffff",
                backgroundColor: panel_color,
                zIndex: 10,
              }}
              variants={panelVariants}
              initial="slideIn"
              animate="visible"
              exit="slideOut"
            >
              <About />
            </motion.div>
          )}
          {currentPanel === "cv" && (
            <motion.div
              key="cv"
              className="cv-overlay"
              style={{
                color: "#ffffff",
                backgroundColor: panel_color,
                zIndex: 10,
              }}
              variants={panelVariants}
              initial="slideIn"
              animate="visible"
              exit="slideOut"
            >
              <CV />
            </motion.div>
          )}
        </AnimatePresence>
      </Router>

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
