import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { VRButton, XR } from "@react-three/xr";

import AppScene from "./AppScene";
import useImmersiveVR from "./hooks/useImmersiveVR";
import AudioButton from "./components/audioButton";

function Buttons({ supportsVR }: { supportsVR: boolean }) {
  const audio = useMemo(
    () =>
      new Audio(
        "https://12brolls.com/portfolio/syntwave-experiment/WHITE_BAT_AUDIO.mp3"
      ),
    []
  );

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing) {
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [playing]);

  return (
    <>
      {supportsVR && (
        <VRButton
          onClick={() => {
            setPlaying(true);
          }}
        />
      )}
      <AudioButton playing={playing} setPlaying={setPlaying} />
    </>
  );
}

export default function Home() {
  const supportsVR = useImmersiveVR();

  if (supportsVR === null) {
    return null;
  }

  return (
    <>
      <Buttons supportsVR={supportsVR} />
      <Canvas style={{ height: "100vh" }} dpr={1}>
        <XR>
          <AppScene />
        </XR>
      </Canvas>
    </>
  );
}
