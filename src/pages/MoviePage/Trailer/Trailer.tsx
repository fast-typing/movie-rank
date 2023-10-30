import { Button, Modal } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useState } from "react";

export default function Trailer({ movie }) {
    const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

    return (
        <div className="grid gap-4 md:max-w-[30%] min-w-[350px]">
            <img src={movie.poster} className="rounded object-cover w-full" alt={movie.title} />
            <Button
                startIcon={<PlayArrowRoundedIcon />}
                variant="contained"
                className="h-fit"
                onClick={() => setVideoModalOpen(true)}
            >
                Смотреть трейлер
            </Button>
            <div>
                <Modal
                    open={videoModalOpen}
                    onClose={() => setVideoModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="modalContent w-4/5 xl:w-1/2">
                        <h2>Трейлер к фильму {movie.title}</h2>
                        <video className="rounded w-full" controls>
                            <source src={movie.trailer} type="video/mp4" />
                            Your browser doesn't support HTML5 video tag.
                        </video>
                        {/* <VideoPlayer id={'yWtFb9LJs3o'} /> */}
                    </div>
                </Modal>
            </div>
        </div>
    )
}