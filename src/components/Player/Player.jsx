import { useSelector } from "react-redux";
import { FaRandom, FaStepBackward, FaPlay, FaStepForward, FaRedo } from "react-icons/fa";
import "./Player.css";

export default function Player() {
  const currentTrack = useSelector((state) => state.music.currentTrack);

  return (
    <footer className="player">
      <div className="player-track-info">
        {currentTrack && (
          <>
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              className="player-track-image"
            />
            <div className="player-track-text">
              <span className="player-track-title">{currentTrack.title}</span>
              <span className="player-track-artist">{currentTrack.artist}</span>
            </div>
          </>
        )}
      </div>

      <div className="player-controls">
        <button type="button" className="player-control-btn" aria-label="Shuffle">
          <FaRandom />
        </button>
        <button type="button" className="player-control-btn" aria-label="Previous">
          <FaStepBackward />
        </button>
        <button type="button" className="player-control-btn player-play-btn" aria-label="Play">
          <FaPlay />
        </button>
        <button type="button" className="player-control-btn" aria-label="Next">
          <FaStepForward />
        </button>
        <button type="button" className="player-control-btn" aria-label="Repeat">
          <FaRedo />
        </button>
      </div>
    </footer>
  );
}
