/**
 * Generates sky with starts.
 * Draws a bunch of dots on a canvas an uses it as a texture for the sky spehere.
 */
import * as THREE from "three";

const canvas = document.createElement("canvas");

canvas.height = 1024;
canvas.width = 1024;
const ctx = canvas.getContext("2d")!;

ctx.strokeStyle = "#ffffff";
for (let i = 0; i < 30; i++) {
  ctx.beginPath();
  ctx.arc(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    Math.random() * 3,
    0,
    2 * Math.PI
  );
  ctx.stroke();
}

const texture = new THREE.CanvasTexture(canvas);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(5, 5);

export default function Sky() {
    // document.body.appendChild(canvas);
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[500, 32, 32]} />
      <meshStandardMaterial
        color={[3, 1, 1]}
        side={THREE.BackSide}
        map={texture}
      />
    </mesh>
  );
}
