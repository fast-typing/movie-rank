import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import { Button, IconButton, Modal, Rating, Skeleton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { favoriteToggle, getMovie, getReviews, getUserData, markFilm } from "../../services/http.service";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { movieFieldsC, toggleButtonsC } from "../../App.constants";
import { changeBooleanTypesOfMovies } from "../../services/movieField.service";
import Reviews from "./Reviews/Reviews";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PageSkeleton from "./PageSkeleton/PageSkeleton";

export default function MoviePage() {
  const [movie, setMovie] = useState<Movie>(null);
  const [alignment, setAlignment] = useState<"postopened" | "abandoned" | "finished" | "planned">(null);
  const [detailedInfo, setDetailedInfo] = useState(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingButtons, setLoadingButtons] = useState<boolean>(false);
  const [favorite, setFavorite] = useState({
    isFavorite: false,
    loading: false,
  });
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  const { id } = useParams();
  const movieFields = movieFieldsC;

  useEffect(() => {
    const init = async () => {
      let resMovies = await getMovie(id);
      const token = localStorage.getItem("token") ?? "";
      const user = await getUserData(token);
      if (!resMovies || !user) return;
      resMovies = changeBooleanTypesOfMovies([resMovies], user)[0];
      setFavorite({ ...favorite, isFavorite: resMovies.is_favorite });

      const info = [];
      for (let key of Object.keys(movieFields)) {
        info.push(
          <div className="flex gap-2 justify-between md:justify-normal text-sm">
            <span className="md:w-[140px]">{movieFields[key]}: </span>
            <h3 className="text-sm text-right md:text-left">
              {Array.isArray(resMovies[key])
                ? resMovies[key].map((el) => <span>{el}, </span>) ?? "-"
                : resMovies[key] ?? "-"}
            </h3>
          </div>
        );
      }

      let alignment = null;
      if (resMovies.is_abandoned) alignment = "abandoned";
      else if (resMovies.is_planned) alignment = "planned";
      else if (resMovies.is_postponed) alignment = "postponed";
      else if (resMovies.is_finished) alignment = "finished";
      setAlignment(alignment);

      setMovie(resMovies);
      setDetailedInfo(info);
      setLoading(false);
    };

    init();
  }, []);

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "postopened" | "abandoned" | "finished" | "planned"
  ) => {
    setLoadingButtons(true);
    const user_id = localStorage.getItem("user_id") ?? "";
    if (newAlignment === null) {
      const res = await markFilm(user_id, movie.id, alignment);
      if (res.Message) setAlignment(null);
    } else {
      const res = await markFilm(user_id, movie.id, newAlignment);
      if (res.Message) setAlignment(newAlignment);
    }
    setLoadingButtons(false);
  };

  async function toggleFavorite() {
    setFavorite({ ...favorite, loading: true });
    const user_id = localStorage.getItem("user_id") ?? "";
    const res = await favoriteToggle(user_id, movie.id);
    if (res.Message) {
      setFavorite({ loading: false, isFavorite: !favorite.isFavorite });
    } else {
      setFavorite({ ...favorite, loading: false });
    }
  }

  const toggleButtons = toggleButtonsC.map((item) => {
    return (
      <ToggleButton className="w-full grid md:w-fit md:flex" value={item.value}>
        {item.icon}
        <span className="ml-1 hidden md:block">{item.text}</span>
      </ToggleButton>
    );
  });

  const floatIcon = favorite.loading ? (
    <RefreshRoundedIcon className="loading" />
  ) : favorite.isFavorite ? (
    <BookmarkIcon />
  ) : (
    <BookmarkBorderIcon />
  );

  return (
    <div>
      {loading ? (
        <PageSkeleton />
      ) : (
        <div className="grid gap-12 w-full">
          <div className="w-full grid gap-4">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
              <h1>{movie.title}</h1>
              <div className="flex gap-1 items-center">
                <Rating max={10} precision={0.5} defaultValue={movie.average_rating} size="large" readOnly />
                <p className="text-lg">{movie.average_rating}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <IconButton color="primary" disabled={favorite.loading} onClick={toggleFavorite}>
                {floatIcon}
              </IconButton>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                disabled={loadingButtons}
                className="w-full md:w-fit"
              >
                {toggleButtons}
              </ToggleButtonGroup>
            </div>
          </div>
          <div className="grid md:flex gap-8 w-full">
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
            <div className="w-full">
              <h2 className="mb-4">О фильме</h2>
              <div className="grid gap-4">{detailedInfo}</div>
            </div>
          </div>
          <Reviews film_id={id} />
        </div>
      )}
    </div>
  );
}
