import { useRef, useEffect, useState } from "react";
import { TextureLoader } from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import smokeURL from "../assets/smoke_1_black.png";

function SmokeEffect() {
  const smokeTexture = useLoader(TextureLoader, smokeURL); // Load the smoke texture
  const smokeRefs = useRef<Mesh[]>([]); // Array of references for smoke planes

  // State to store dynamic boundaries
  const [boundaries, setBoundaries] = useState({ left: -30, right: 30 });

  // Calculate boundaries based on viewport width
  useEffect(() => {
    const updateBoundaries = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const sceneWidth = 30 * aspectRatio; // Adjust based on your scene scale
      setBoundaries({ left: -sceneWidth, right: sceneWidth });
    };

    updateBoundaries(); // Set initial boundaries
    window.addEventListener("resize", updateBoundaries); // Update on resize

    return () => {
      window.removeEventListener("resize", updateBoundaries); // Cleanup
    };
  }, []);

  // Create an array of smoke planes with random initial positions and rotations
  const smokePlanes = Array.from({ length: 70 }, (_, i) => ({
    map: smokeTexture,
    transparent: true,
    opacity: 1.0,
    id: i,
    position: [
      Math.random() * (boundaries.right - boundaries.left) + boundaries.left,
      Math.random() * 22 - 10.5,
      Math.random() * -5 - 5,
    ],
    rotation: Math.random() * Math.PI * 2,
    scale_factor: Math.random() * 2.0 + 0.5,
    scale: [
      Math.random() * 2.0 + 0.5,
      Math.random() * 2.0 + 0.5,
      Math.random() * 2.0 + 0.5,
    ],
  }));

  // Animate the smoke planes to move from right to left
  useFrame(() => {
    smokeRefs.current.forEach((smoke, _index) => {
      if (smoke) {
        smoke.position.x -= 0.01; // Move left
        smoke.rotation.z -= 0.001; // Rotate
        if (smoke.position.x < boundaries.left) {
          // Reset position when off-screen
          smoke.position.x = boundaries.right;
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
          scale={[plane.scale_factor, plane.scale_factor, plane.scale_factor]}
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

export default SmokeEffect;
