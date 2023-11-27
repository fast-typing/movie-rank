import { Button, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./Trailer.css";

export default function Trailer({ movie }) {
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  function getMovieTrailer(): string {
    console.log(movie.trailer?.replace("watch?v=", "embed/"))
    return movie.trailer?.replace("watch?v=", "embed/");
  }

  return (
    <>
      <div className="trailer h-[40vh] md:h-[inherit]" onClick={() => setVideoModalOpen(true)}>
        <img src={movie.poster} alt={movie.title} />
        <Button variant="contained" className="play-button">
          Смотреть трейлер
        </Button>
      </div>
      <Modal open={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
        <div className="modal-content w-full md:w-1/2">
          <div className="flex justify-between items-center w-full">
            <h2>Трейлер к фильму {movie.title}</h2>
            <IconButton onClick={() => setVideoModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          {
            movie.trailer
              ? <iframe className="aspect-video w-full rounded" allowFullScreen src={getMovieTrailer()}></iframe>
              : 'Трейлера нету :('
          }
        </div>
      </Modal>
    </>
  );
}
