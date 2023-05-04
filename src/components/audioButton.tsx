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
  
  
export default function AudioButton({playing, setPlaying}: {playing: boolean, setPlaying: (playing: boolean) => void}) {
    return (
        <div style={audioStyles} onClick={() => setPlaying(!playing)}>
            <img src={playing ? "sound-medium-icon.svg" : "sound-off-icon.svg"} style={{width: "100%", height: "100%"}} />
        </div>
    );
}