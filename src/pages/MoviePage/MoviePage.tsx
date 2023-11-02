import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import { getAllComments, getMovie, getReviews, getUserData } from "../../services/http.service";
import { MOVIE_FIELDS } from "../../App.constants";
import Reviews from "./Reviews/Reviews";
import PageSkeleton from "./PageSkeleton/PageSkeleton";
import Trailer from "./Trailer/Trailer";
import { changeBooleanTypesOfMovies } from "../../services/movieField.service";
import { Rating } from "@mui/material";
import Widgets from "./Widgets/Widgets";
import Comments from "./Comments/Comments";

export default function MoviePage() {
  const [movie, setMovie] = useState<Movie>(null);
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [reviews, setReviews] = useState(null)
  const [comments, setComments] = useState(null)
  const [loading, setLoading] = useState<boolean>(true);
  const { filmId } = useParams();

  useEffect(() => {
    const init = async () => {
      const resMovie = await getMovie(filmId);
      const resReviews = await getReviews(filmId);
      const resComments = await getAllComments(filmId);
      const token = localStorage.getItem("token") ?? "";
      const user = await getUserData(token);
      if (!resMovie) return;
      const correctedMovies = changeBooleanTypesOfMovies([resMovie], user)[0];

      initDetailedInfo(correctedMovies)
      setMovie(correctedMovies);
      setReviews(resReviews)
      setComments(resComments)
      setLoading(false);
    };

    init();
  }, []);

  function initDetailedInfo(movie: Movie) {
    const info = [];
    const movieFields = MOVIE_FIELDS;
    for (let key of Object.keys(movieFields)) {
      const layout =
        (<div className="flex gap-2 justify-between md:justify-normal text-sm">
          <span className="md:w-[140px]">{movieFields[key]}: </span>
          <h3 className="text-sm text-right md:text-left">
            {Array.isArray(movie[key]) ? movie[key].join(', ') ?? "-" : movie[key] ?? "-"}
          </h3>
        </div>)

      info.push(layout);
    }

    setDetailedInfo(info);
  }

  return (
    loading ? (
      <PageSkeleton />
    ) : (
      <div className="grid gap-12 w-full">
        <div className="w-full grid gap-4">
          <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
            <h1>{movie.title}</h1>
            <div className="flex gap-1 items-center">
              <Rating max={10} precision={0.1} defaultValue={movie.average_rating} size="large" readOnly />
              <p className="text-lg">{movie.average_rating}</p>
            </div>
          </div>
          <Widgets movie={movie} />
        </div>
        <div className="grid md:flex gap-8 w-full">
          <Trailer movie={movie} />
          <div className="w-full">
            <h2 className="mb-4">О фильме</h2>
            <div className="grid gap-4">{detailedInfo}</div>
          </div>
        </div>
        <Reviews film_id={filmId} reviews={reviews} />
        <Comments comments={comments} />
      </div>
    )
  );
}
