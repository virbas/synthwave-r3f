/**
 * Renders the sun with black stripes covering it.
 * The stripes are created using the Mask component from drei.
 */
import {
  Mask,
  MeshDistortMaterial,
  useMask,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  Mesh,
  Object3D,
} from "three";

/**
 * Params of stripes covering the sun
 */
const maskBaseY = 30;
const maskParams = [
  {
    y: maskBaseY + 10,
    size: 1,
  },

  {
    y: maskBaseY + 0,
    size: 2,
  },

  {
    y: maskBaseY + -12,
    size: 3,
  },

  {
    y: maskBaseY + -25,
    size: 4,
  },

  {
    y: maskBaseY + -40,
    size: 5,
  },

  {
    y: maskBaseY + -57,
    size: 2,
  },
];

export default function Sun() {
  const sunRef = useRef<Mesh>(null);

  /**
   * Move the sun up over time.
   */
  useFrame((_, delta) => {
    sunRef.current!.position.y = Math.min(
      40,
      sunRef.current!.position.y + delta * 3
    );
  });

  const lightHelper = useRef(null);
  // useHelper(lightHelper as any, SpotLightHelper, 0xff0000);

  const target = useMemo(() => new Object3D(), []);
  const stencil = useMask(1, true);

  return (
    <group position={[0, 0, -400]}>
      {maskParams.map(({ y, size }, key) => (
        <Mask position={[0, y, 70]} id={1} key={key}>
          <planeGeometry args={[200, size, 128, 128]} />
          <MeshDistortMaterial distort={0.3} speed={10} />
        </Mask>
      ))}

      <primitive object={target} position={[0, 0, 400]} />
      <spotLight
          ref={lightHelper}
          position={[0, 59, 250]}
          intensity={0.3}
          color={"#ff6600"}
          target={target}
          castShadow={false}
        />
     
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[60, 32, 32]} />
        <MeshDistortMaterial
          distort={0.1}
          speed={10}
          color={"#ff6600"}
          {...stencil}
        />
 

        {/** <directionalLight
          ref={lightHelper}
          position={[0, 0, 0]}
          intensity={0.1}
          color={"#ff6600"}
          castShadow={false}
          target={target}
        />
         */}

       
      </mesh>
    </group>
  );
}

/*
target={target}
ref={lightHelper}*/
