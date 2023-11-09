import { Button, IconButton, Modal, Rating, ToggleButton, ToggleButtonGroup } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useContext, useEffect, useState } from "react";
import { favoriteToggle, markFilm, rateFilm } from "../../../services/http.service";
import { TOGGLE_BUTTONS } from "../../../App.constants";
import StarIcon from "@mui/icons-material/Star";
import { red } from "@mui/material/colors";
import { AuthContext } from "../../../context/AuthProvider";
import CloseIcon from "@mui/icons-material/Close";
import TouchAppRoundedIcon from "@mui/icons-material/TouchAppRounded";
import "./Widgets.css";

export default function Widgets({ movie }) {
  const [alignment, setAlignment] = useState<"postopened" | "abandoned" | "finished" | "planned">(null);
  const [loadingButtons, setLoadingButtons] = useState<boolean>(false);
  const [favorite, setFavorite] = useState({ isFavorite: movie.is_favorite, loading: false });
  const [modal, setModal] = useState({ open: false, rating: 0 });
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    let alignment = null;
    if (movie.is_abandoned) alignment = "abandoned";
    else if (movie.is_planned) alignment = "planned";
    else if (movie.is_postponed) alignment = "postponed";
    else if (movie.is_finished) alignment = "finished";
    setAlignment(alignment);
  }, []);

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "postopened" | "abandoned" | "finished" | "planned"
  ) => {
    setLoadingButtons(true);
    const token = localStorage.getItem("token") ?? "";
    if (newAlignment === null) {
      const res = await markFilm(token, movie.id, alignment);
      if (res.Message) setAlignment(null);
    } else {
      const res = await markFilm(token, movie.id, newAlignment);
      if (res.Message) setAlignment(newAlignment);
    }
    setLoadingButtons(false);
  };

  const floatIcon = favorite.loading ? (
    <RefreshRoundedIcon className="loading" />
  ) : favorite.isFavorite ? (
    <BookmarkIcon />
  ) : (
    <BookmarkBorderIcon />
  );

  async function toggleFavorite() {
    setFavorite({ ...favorite, loading: true });
    const token = localStorage.getItem("token") ?? "";
    const res = await favoriteToggle(token, movie.id);
    if (res.Message) {
      setFavorite({ isFavorite: !favorite.isFavorite, loading: false });
    } else {
      setFavorite({ ...favorite, loading: false });
    }
  }

  async function rateMovie() {
    const user_id = localStorage.getItem("user_id");
    const res = await rateFilm({ user_id: user_id, film_id: movie.id, rating: modal.rating });
    if (!res.Message) return;
    window.location.reload();
  }

  function toggleModal() {
    setModal({ ...modal, open: !modal.open });
  }

  const toggleButtons = TOGGLE_BUTTONS.map((item) => {
    return (
      <ToggleButton className="w-full grid md:w-fit md:flex" value={item.value}>
        {item.icon} <span className="ml-1 hidden md:block">{item.text}</span>
      </ToggleButton>
    );
  });

  return (
    <div className="grid w-full lg:flex lg:justify-between">
      <div className="w-full md:w-fit">
        <div className="flex items-center mb-4">
          <IconButton color="primary" className="h-fit" disabled={favorite.loading} onClick={toggleFavorite}>
            {floatIcon}
          </IconButton>
          <h1 className="ml-4">{movie.title}</h1>
        </div>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          disabled={loadingButtons}
          className="w-full"
        >
          {toggleButtons}
        </ToggleButtonGroup>
      </div>
      <div className="mt-4 lg:mt-0 ratings">
        <div className="rating">
          <span>Кинопоиск</span>
          <div className="flex items-center">
            <StarIcon sx={{ color: red[500] }} />
            <h2 className="ml-1">{movie.average_rating} </h2>
          </div>
        </div>
        <div className="rating" onClick={toggleModal}>
          <div className="flex items-center">
            <TouchAppRoundedIcon color="primary" />
            <span>Movie Rank</span>
          </div>
          <div className="flex items-center">
            <StarIcon sx={{ color: red[500] }} />
            <h2 className="ml-1">{movie.local_rating.toFixed(1)} </h2>
          </div>
        </div>
      </div>
      <Modal open={modal.open} onClose={toggleModal}>
        <div className="modal-content w-4/5 xl:w-1/4">
          <div className="relative text-center">
            <h3 className="modal-title">Ваша оценка фильму {movie.title}</h3>
            <IconButton className="!absolute top-[-60px] right-[-20px]" onClick={toggleModal}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="flex items-center justify-center flex-col">
            <Rating
              onChange={(e, value) => setModal({ ...modal, rating: value })}
              className="w-fit mr-4"
              max={10}
              defaultValue={modal.rating}
              readOnly={!isAuth}
            />
            <h1>{modal.rating ?? 0}</h1>
          </div>
          <Button className="w-full" variant="contained" onClick={rateMovie}>
            Оценить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
