/**
 * Hook to check if VR is supported by the hardware
 */
import { useEffect, useState } from "react";

export default function useImmersiveVR() {
    const [isXRSupported, setIsXRSupported] = useState<boolean | null>(null);
    useEffect(() => {
      if (!navigator.xr) {
        setIsXRSupported(false);
      } else {
        navigator.xr.isSessionSupported("immersive-vr").then((isSupported) => {
          setIsXRSupported(isSupported);
        });
      }
    }, [setIsXRSupported]);
  
    return isXRSupported;
  }
  