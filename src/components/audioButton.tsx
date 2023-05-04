import { useMemo, useState, useEffect } from "react";


const audioStyles = {
    zIndex: 100,
    bottom: "28px",
    right: "28px",
    position: "absolute",
    background: "#ffaa00",
    width: "30px",
    height: "30px",
    padding: "5px",
    borderRadius: "50%",
    cursor: "pointer",
  } as const;
  
  
export default function AudioButton() {
    const audio = useMemo(() => new Audio("WHITE BAT AUDIO .mp3"), []);
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
        <div style={audioStyles} onClick={() => setPlaying(!playing)}>
            <img src={playing ? "sound-medium-icon.svg" : "sound-off-icon.svg"} style={{width: "100%", height: "100%"}} />
        </div>
    );
}