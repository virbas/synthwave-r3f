/**
 * Just a plane with a texture of the building for the background.
 * Building are really low quality, but since they are far away - it's fine.
 */
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const width = 144 / 2;
const height = 73 / 3;

export default function Buildings() {
  const colorMap = useLoader(TextureLoader, "buildings.png");
  return (
    <mesh position={[0, height / 2 - 2, -300]}>
      <planeGeometry args={[width, height, 1, 1]} />
      <meshStandardMaterial map={colorMap} transparent={true} />
    </mesh>
  );
}
