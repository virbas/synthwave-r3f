/**
 * Render clouds using SimplexNoise.
 * Generates a 64x64 canvas with a animated noise pattern and draws into CanvasTexture.
 * The sides of the canvas are faded out to avoid hard edges.
 * CanvasTexture is then rendered with a Partial cylinder geometry.
 */
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

const noise = new SimplexNoise();
const canvas = document.createElement("canvas");
canvas.height = 64;
canvas.width = 64;

/**
 * For visual instructions, uncomment and document.body.appendChild(canvas)
 */
/*canvas.style.position = "absolute";
canvas.style.bottom = "0px";
canvas.style.left = "0px";
canvas.style.width = "256px"
canvas.style.height = "256px"*/

const ctx = canvas.getContext("2d")!;

const size = canvas.width;
const halfSize = size / 2;
const data = ctx.getImageData(0, 0, size, size).data;

let time = 0;
function getNoisePixel(x: number, y: number) {
  // const c1 = noise.noise3d( (x + time )/ size * 4, (y + time) / size * 4, time / 10 );
  // const c2 = 2 * noise.noise( (x + time )/ size * 4, (y + time) / size * 4 );
  // const c1 = noise.noise3d( (x + time )/ size * 4, (y + time) / size * 4, time / 10 );
  // const c2 = noise.noise( (x )/ size * 4, y / size * 4 );

  const c1 = noise.noise3d((x + time) / size, y / size, (x + time) / size);
  // const c2 = noise.noise( (x * 2 )/ size * 4, (y * 2) / size * 4 );
  // const c3 = 2 * noise.noise( (x * 4 )/ size * 4, (y * 4) / size * 4 );
  // return c1 + c2 + c3

  return c1;

  // return c1;
}

function setCanvasPixel(x: number, y: number) {
  /**
   * Add multiple noises to achieve a more natural look of a cloud.
   */
  const color =
    (16 * getNoisePixel(x, y) +
      8 * getNoisePixel(2 * x, 2 * y) +
      4 * getNoisePixel(4 * x, 4 * y) +
      2 * getNoisePixel(8 * x, 8 * y)) /
    5;
  const index = (x + y * size) * 4;
  data[index + 0] = 0xf2 * color;
  data[index + 1] = 0x22 * color;
  data[index + 2] = 0xff * color;

  /**
   * Fade out the left, right, and top edges of the canvas.
   * Bottom can stay hard, since it's hidden by the ground.
   * */
  const dx = (halfSize - Math.abs(halfSize - x)) / size;
  const dy = (y - 20) / size;
  data[index + 3] = dy * dx * 256;
}

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    setCanvasPixel(x, y);
  }
}
ctx.putImageData(new ImageData(new Uint8ClampedArray(data), size, size), 0, 0);
const texture = new THREE.CanvasTexture(canvas);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set(2, 2);*/

export default function Clouds() {
  /**
   * Move the noise pattern over time.
   */
  useFrame((_, delta) => {
    time += delta * 3;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        setCanvasPixel(x, y);
      }
    }
    ctx.putImageData(
      new ImageData(new Uint8ClampedArray(data), size, size),
      0,
      0
    );
    texture.needsUpdate = true;
  });

  return (
    <mesh position={[0, 170, -200]}>
      <cylinderGeometry
        args={[200, 200, 400, 16, 16, true, Math.PI / 2, Math.PI]}
      />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
