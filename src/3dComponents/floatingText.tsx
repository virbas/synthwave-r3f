/**
 * Text with credits floating along the sine wave.
 */
import {Text3D } from "@react-three/drei";
import { useMemo, useRef } from "react";
import {
  CatmullRomCurve3,
  Mesh,
  Vector3,
  MeshStandardMaterial,
} from "three";

//import { glyphs } from "../../public/Sigmar_Regular.json";
import font, { glyphs } from "../assets/Sigmar_Regular.json";
import { useFrame } from "@react-three/fiber";

function Letter({
    letter,
    letterPos,
    material,
    curve,
  }: {
    letter: string;
    letterPos: number;
    material: MeshStandardMaterial;
    curve: CatmullRomCurve3;
  }) {
    const ref = useRef<Mesh>(null!);
    let elapsedTime = 0;
    useFrame((_, delta) => {
      elapsedTime += delta / 40;
      let time = letterPos / 120 + elapsedTime;
      if (time > 1) {
        elapsedTime -= 1;
        time = letterPos / 120 + elapsedTime;
      }
  
      const pos = curve.getPoint(time);
      ref.current.position.x = pos.x;
      ref.current.position.y = pos.y;
      ref.current.position.z = pos.z;
    });
  
    return (
      <Text3D
        ref={ref}
        size={1}
        bevelEnabled={false}
        scale={0.015}
        font={font as any}
        material={material}
      >
        {letter}
      </Text3D>
    );
  }

export default function FloatingText({ position }: { position: Vector3 }) {

     /**
   *  Generate a sine wave points
   **/
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        Array.from({ length: 50 }).map(
          (_, i) => new Vector3(5 - i / 10, Math.cos(i) / 64) // sine wave starting from right side, wawing left
        ),
        false,
        "centripetal"
      ),
    []
  );

  const letters = Array.from(
    "KARL CASEY @ WHITE BAT AUDIO                                                      https://sketchfab.com/evolveduk"
  ).reverse();
  /**
   * Sinve each letter is it's own geometry, we have to track the position + width of the last letter manually
   */
  let lastSpace = 0;

  const material = useMemo(
    () => new MeshStandardMaterial({ color: 0xffffff }),
    []
  );

  return (
    <group position={position}>
      {/*  <primitive object={line} /> */}
      <>
        {letters.map((letter, x) => {
          const letterWidth = glyphs[letter as keyof typeof glyphs].ha / 2000;
          lastSpace += letterWidth;
          return (
            <Letter
              key={x}
              letter={letter}
              letterPos={lastSpace}
              material={material}
              curve={curve}
            />
          );
        })}
      </>
    </group>
  );
}
