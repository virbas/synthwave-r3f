import {  useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { VRButton, XR } from "@react-three/xr";

import AppScene from "./AppScene";
import useImmersiveVR from "./hooks/useImmersiveVR";
import AudioButton from "./components/audioButton";

export default function Home() {
  const supportsVR = useImmersiveVR();
  const audio = useMemo(() => new Audio("WHITE BAT AUDIO .mp3"), []);

  if (supportsVR === null) {
    return null;
  }

  return (
    <>
     
      {supportsVR && <VRButton onClick={() => {audio.play()}} />}
      <AudioButton />
      
      <Canvas style={{ height: "100vh" }} dpr={1}>
        <XR>
          <AppScene />
        </XR>
      </Canvas>
    </>
  );
}
