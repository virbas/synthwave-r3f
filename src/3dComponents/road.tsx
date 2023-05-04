/**
 * The endless road component
 */
import { useFrame, useLoader } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * numTileW -  how wide is the track
 * numTileH - how long is the track
 */
const numTileW = 20;
const numTileH = 600;

/**
 * We will dynamically generate a texture for the ground.
 */
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;

/**
 * For visual debugging, uncomment and document.body.appendChild(canvas)
 */
// canvas.width = 64;
// canvas.height = 64;
// canvas.style.position = "absolute";
// canvas.style.top = "0px";
// canvas.style.left = "0px";
// canvas.style.width = "64px";
// canvas.style.height = "64px";

/**
 * Draw a square on the canvas with lineWidth border and color.
 */
ctx.strokeStyle = "#8c1eff";
ctx.lineWidth = 8;
ctx.strokeRect(0, 0, canvas.width, canvas.height);

/**
 * Create texture from the canvas.
 * And repeat it.
 */
const colorMap = new THREE.CanvasTexture(canvas);
colorMap.wrapS = THREE.RepeatWrapping;
colorMap.wrapT = THREE.RepeatWrapping;
colorMap.repeat.set(numTileW, numTileH);

/**
 * Some constants for the hills.
 */
const lastTileW = numTileW + 1;
const lastTileH = numTileH + 1;
const halfW = numTileW / 2;
const middleTiles = numTileW / 7;

/**
 * We will using two geometries for the endles road.
 * We will swap them when the first one is out of the viewing range.
 * 
 * To tile them correctly, we will use exact same vertex Y position fom the first and the last rows of those geometries.
 */
const heightOfTheHillsOnTheLastRow: Float32Array = new Float32Array(numTileW + 1);
for (let i = 0; i < lastTileW; i++) {

  /**
   * Check if x coord of the vertex is in the middle of the track.
   * If so, set the height to 0.
   * Otherwise, set the height to a random value.
   */
  const x = Math.abs((i % lastTileW) - halfW);
  if (x > middleTiles) {
    const d = (x - middleTiles) / 3;
    heightOfTheHillsOnTheLastRow[i] = Math.random() * d;
  } else {
    heightOfTheHillsOnTheLastRow[i] = 0;
  }
}


/**
 * Randomize the height of the hills.
 * @param positions - positions attribute  of the geometry
 */
const makeHills = (
  positions:
    | THREE.BufferAttribute
    | THREE.InterleavedBufferAttribute
    | THREE.GLBufferAttribute
) => {
  positions.needsUpdate = true;

  /**
   * Set the first row to heightOfTheHillsOnTheLastRow
   */
  for (let i = 0; i < lastTileW; i++) {
    // @ts-expect-error setZ is actually defined on BufferAttribute
      positions.setZ(i, heightOfTheHillsOnTheLastRow[i]);
  }
  /**
   * Set the last row to heightOfTheHillsOnTheLastRow
   */
  let p = 0; 
  for (let i = lastTileW * (lastTileH - 1); i < lastTileW * lastTileH; i++) {
    // @ts-expect-error setZ is actually defined on BufferAttribute
    positions.setZ(i, heightOfTheHillsOnTheLastRow[p++]);
  }

  /**
   * All other rows are randomized.
   */
  for (let i = lastTileW; i < lastTileW * (lastTileH - 1); i++) {
    const x = Math.abs((i % lastTileW) - halfW);
    if (x > middleTiles) {
      const d = (x - middleTiles) / 3;
      // @ts-expect-error setZ is actually defined on BufferAttribute
      positions.setZ(i, Math.random() * d);
    }
  }
};

/**
 * 
 * @param container - we will need to know the position of the parent container to correctly swap the grond geometries. 
 * @returns 
 */
export default function Road({container }: {container: React.MutableRefObject<THREE.Group>;}) {

  /**
   * We'll be using two geometries for the endless road.
   * And swap them when the first one is out of the viewing range.
   */
  const ref1 = useRef<THREE.Mesh>(null!);
  const ref2 = useRef<THREE.Mesh>(null!);

  /**
   * constructor
   */
  useEffect(() => {
    makeHills(ref1.current.geometry.getAttribute("position"));
    makeHills(ref2.current.geometry.getAttribute("position"));
  }, []);

  const bumpMap = useLoader(THREE.TextureLoader, "floor-bump.jpeg");
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(numTileW, numTileH);


  /**
   * The bumps on the road looks awfully in VR
   */
  const isInVR = useXR((state) => state.isPresenting);

  useFrame(() => {
    /**
     * Push the geometry to front when it geoes out of the viewing range.
     */
    if(container.current.position.z + ref1.current.position.z > numTileH) {
      ref1.current.position.z -= numTileH * 2;
    }

    if(container.current.position.z + ref2.current.position.z > numTileH) {
      ref2.current.position.z -= numTileH * 2;
    }
  });

  const roughness=0.5
  const metalness=0.0

  return (
    <>
      <mesh
        ref={ref1}
        rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
        position={[0, 0, 0]}
        >
        <planeGeometry
          args={[numTileW, numTileH, numTileW, numTileH]}
        />
        <meshStandardMaterial
          wireframe={false}
          map={colorMap}
          bumpMap={isInVR ? null : bumpMap}
          bumpScale={0.0025}
          toneMapped={false}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      <mesh
        ref={ref2}
        rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
        position={[0, 0, -numTileH]}
      >
        <planeGeometry
          args={[numTileW, numTileH, numTileW, numTileH]}
        />
        <meshStandardMaterial
          wireframe={false}
          map={colorMap}
          toneMapped={false}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </>
  );
}