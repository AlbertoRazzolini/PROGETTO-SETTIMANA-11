import { useDispatch, useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { setCurrentTrack, toggleFavorite } from "../../redux/musicSlice";
import "./SongCard.css";

export default function SongCard({ track }) {
  const dispatch = useDispatch();
  const isFavorite = useSelector((state) => state.music.favorites.includes(track.id));

  const handleCardClick = () => {
    dispatch(
      setCurrentTrack({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        image: track.album.cover_medium,
      })
    );
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(track.id));
  };

  return (
    <Card className="song-card" onClick={handleCardClick}>
      <Card.Img variant="top" src={track.album.cover_medium} alt={track.title} />
      <Card.Body className="text-center">
        <Card.Text className="song-card-title" title={track.title}>
          Track: &quot;{track.title}&quot;
        </Card.Text>
        <Card.Text className="song-card-artist">Artist: {track.artist.name}</Card.Text>
        <button
          type="button"
          className="song-card-heart"
          onClick={handleHeartClick}
          aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </Card.Body>
    </Card>
  );
}
