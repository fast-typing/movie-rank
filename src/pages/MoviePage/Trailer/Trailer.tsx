import { Button, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import VideoPlayer from "../../../components/VideoPlayer";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import CloseIcon from "@mui/icons-material/Close";
import "./Trailer.css";

export default function Trailer({ movie }) {
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="trailer h-[40vh] md:h-[inherit]" onClick={() => setVideoModalOpen(true)}>
        <img src={movie.poster} alt={movie.title} />
        <Button
          // startIcon={<KeyboardArrowRightRoundedIcon fontSize="large" />}
          variant="contained"
          className="play-button"
        >
          Смотреть трейлер
        </Button>
      </div>
      <Modal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-content w-full xl:w-1/2">
          <div className="flex justify-between items-center w-full">
            <h2>Трейлер к фильму {movie.title}</h2>
            <IconButton onClick={() => setVideoModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <video className="rounded w-full" controls>
            <source src={movie.trailer} type="video/mp4" />
            Your browser doesn't support HTML5 video tag.
          </video>
          {/* <VideoPlayer id={"dQw4w9WgXcQ"} /> */}
        </div>
      </Modal>
    </>
  );
}
