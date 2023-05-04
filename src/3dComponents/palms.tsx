/**
 * Generates palm tress along the road.
 * @param container - we will need to know the position of the parent container to correctly swap the palm positions.
 */
import { Merged, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Euler, Group, Mesh, Vector3 } from "three";

/**
 * Palm components, tracks it's position and respaws itself when it goes out of the viewing range.
 * @param param0
 * @returns
 */
function Palm({
  children,
  position,
  rotation,
  container,
  respawnDistance,
}: {
  children: React.ReactNode
  position: Vector3,
  rotation: Euler,
  container: React.MutableRefObject<THREE.Group>;
  respawnDistance: number;
} ) {
  const ref = useRef<Group>(null!);
  useFrame(() => {
    /**
     * If the palm goes out of the viewing range, move it to the front.
     */
    if (
      container.current.position.z + ref.current.position.z >
      respawnDistance / 2
    ) {
      ref.current.position.z -= respawnDistance;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {children}
    </group>
  );
}

export default function Palms({
  container,
}: {
  container: React.MutableRefObject<THREE.Group>;
}) {
  const { stem, middleThing, leaves } = useMemo(() => {
    const gltf = useGLTF("date_palm_exported.glb");
    const stem = gltf.scene.getObjectByName("Tree_0_Tree_0Mat_0") as Mesh;
    const middleThing = gltf.scene.getObjectByName(
      "Tree_3_Tree_3Mat_0"
    ) as Mesh;
    const leaves = gltf.scene.getObjectByName("Tree_1_Tree_1Mat_0") as Mesh;
    return { stem, middleThing, leaves };
  }, []);


  const numPalms = 40;
  const distanceBetweenPalms = 10;
  const respawnDistance = numPalms * distanceBetweenPalms;
  const half = respawnDistance / 2;

  /**
   * Render palms as a single mesh to improve performance.
   * Make sure to set frustumCulled to false to prevent the mesh from being culled
   * when the meshes are respawned
   */
  return (
    <Merged meshes={[middleThing, stem, leaves]} frustumCulled={false}>
      {(MiddleThing: any, Stem: any, Leaves: any) => {
        return (
          <>
            {Array.from({ length: numPalms }, (_, i) => (
              <Palm
                key={i}
                position={
                  new Vector3(
                    (i % 2 ? 1 : -1) * 7 + Math.random() * 3 - 1.5,
                    0,
                    -i * distanceBetweenPalms + half
                  )
                }
                rotation={new Euler(0, i % 2 ? Math.PI : 0, 0)}
                respawnDistance={respawnDistance}
                container={container}
              >
                <Stem />
                <Leaves />
                <MiddleThing />
              </Palm>
            ))}
          </>
        );
      }}
    </Merged>
  );
}
