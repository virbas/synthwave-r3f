import { Mask, useMask } from "@react-three/drei";
import * as THREE from "three";

function Atom({ invert, ...props }: any) {
  const stencil = useMask(1, invert);
  return (
    <mesh
      castShadow
      receiveShadow
      geometry={new THREE.SphereGeometry(1, 32, 32)}
      position={[0, 0, 0]}
      {...props}
      dispose={null}
    >
      <meshPhongMaterial color="#33BBFF" {...stencil} />
    </mesh>
  );
}

export default function MaskedSun() {
  return (
    <>
      <Mask id={1} position={[0, 0, 0.95]}>
        <planeGeometry args={[0.5, 0.5]} />
      </Mask>

      <Atom invert={true} />
    </>
  );
}
