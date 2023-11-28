import { useState } from "react";
import { Movie } from "../../interfaces/Interfaces";
import StarIcon from "@mui/icons-material/Star";
import "./MovieCard.css";
import IconButton from "@mui/material/IconButton";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useNavigate } from "react-router-dom";
import { favoriteToggle } from "../../services/http.service";
import { red } from "@mui/material/colors";
import { Slide, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Toast from "../Toast";

export default function MovieCard(props: { movie: Movie, hideFavorite?: boolean }) {
  const [favorite, setFavorite] = useState(props.movie.is_favorite);
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const navigate = useNavigate();

  function routeTo(path: string) {
    navigate(path);
  }

  async function toggleFavorite() {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token?.length) {
      setOpenSnackBar(true)
    } else {
      const res = await favoriteToggle(token, props.movie.id);
      if (res.Message) { setFavorite(!favorite); }
    }
    setLoading(false);
  }

  const floatIcon = props.hideFavorite ? null :
    <div className="float-icon">
      <IconButton disabled={loading} onClick={toggleFavorite} color="primary">
        {loading ? (<RefreshRoundedIcon className="loading" />) :
          favorite ? (<BookmarkIcon />) : (<BookmarkBorderIcon />)}
      </IconButton>
    </div>

  return (
    <>
      <div className="card">
        {floatIcon}
        <div className="grid gap-3 sm:gap-2 cursor-pointer h-fit" onClick={() => routeTo(`/movie/${props.movie.id}`)}>
          <img loading="lazy" src={props.movie.poster} alt='картинка' />
          <div className="text">
            <h3 className="two-rows-text text-xs sm:text-lg w-[70%] !leading-tight">{props.movie.title}</h3>
            <div className="flex items-center sm:items-start text-sm sm:text-base">
              <span>{props.movie.average_rating}</span>
              <StarIcon sx={{ color: red[500]}} />
            </div>
          </div>
        </div>
      </div>
      <Toast open={openSnackBar} onClose={() => setOpenSnackBar(false)} message={"Войдите в аккаунт для добавления фильмы в избранное"} />
    </>
  );
}