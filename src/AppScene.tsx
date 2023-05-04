import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { useRef } from "react";
import Road from "./3dComponents/road";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

import Sun from "./3dComponents/sun";

import Sky from "./3dComponents/sky";
import Clouds from "./3dComponents/clouds";
import Palms from "./3dComponents/palms";
import Buildings from "./3dComponents/building";
import { Controllers, Hands, useXR } from "@react-three/xr";
import FloatingText from "./3dComponents/floatingText";

/**
 * In case we are not in VR, we will render the scene with effects.
 */
function Effects() {
  return (
   
      <EffectComposer stencilBuffer>
        <Bloom mipmapBlur={true} luminanceThreshold={0.1} intensity={3} />
        <Noise opacity={0.05} />
        <Vignette eskil={true} offset={0.0} darkness={1.1} />
      
      </EffectComposer>
    
  );
}
export default function AppScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const containerRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    containerRef.current.position.z += delta * 2;
  });

  const isVR = useXR((state) => state.isPresenting);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={new THREE.Vector3(0, 1, 0)}
        ref={cameraRef}
      >
        <FloatingText  position={new THREE.Vector3(-2.5, -0.2, -0.5)} />
      </PerspectiveCamera>
      <OrbitControls target={[0, 1, -1]} enablePan={true} enableZoom={true} />
      <ambientLight />
      <Hands modelRight="right.glb" modelLeft="left.glb" />
      <Controllers />

      <Sky />
      <Sun />
      <Clouds />
      <Buildings />
      <group ref={containerRef}>
        <Road container={containerRef} />
        <Palms container={containerRef} />
      </group>
      {!isVR && <Effects />}
    </>
  );
}
