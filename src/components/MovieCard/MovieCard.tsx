import React, { useState } from "react";
import { Movie } from "../../interfaces/Interfaces";
import StarIcon from "@mui/icons-material/Star";
import "./MovieCard.css";
import { Chip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useNavigate } from "react-router-dom";
import { markFilm } from "../../services/http.service";
import { red } from "@mui/material/colors";

export default function MovieCard(props: { movie: Movie }) {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function getGenres() {
    return props.movie.genres.map((genre) => (
      <Chip onClick={() => routeTo(`/search?genres=${genre}`)} label={genre} variant="outlined" />
    ));
  }

  function routeTo(path: string) {
    navigate(path);
  }

  async function toggleFavorite() {
    setLoading(true);
    const token = localStorage.getItem('token') ?? '';
    const res = await markFilm(token, props.movie.id, "favorite");
    if (typeof res == "string") { setFavorite(!favorite); }
    setLoading(false);
  }

  const floatIcon = loading ? (
    <RefreshRoundedIcon className="loading" />
  ) : favorite ? (
    <BookmarkIcon />
  ) : (
    <BookmarkBorderIcon />
  );

  return (
    <div className="card">
      <div className="float-icon">
        <IconButton disabled={loading} onClick={toggleFavorite} color="primary">
          {floatIcon}
        </IconButton>
      </div>
      <div className="grid gap-1 cursor-pointer" onClick={() => routeTo(`/movie/${props.movie.id}`)}>
        <img src={props.movie.poster} alt={props.movie.poster} />
        <div className="flex justify-between items-center">
          <h2>{props.movie.title}</h2>
          <div className="flex gap-1">
            <span>{props.movie.average_rating}</span>
            <StarIcon sx={{ color: red[500] }} />
          </div>
        </div>
      </div>
      <div className="flex gap-2">{getGenres()}</div>
    </div>
  );
}
