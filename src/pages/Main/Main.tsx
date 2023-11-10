import React, { useEffect, useState } from "react";
import MovieSceleton from "../../components/MovieSkeleton";
import AdaptiveContainer from "../../components/AdaptiveContainer";
import MovieCard from "../../components/MovieCard/MovieCard";
import { getAllMovies } from "../../services/http.service";
import { Movie } from "../../interfaces/Interfaces";
import { markFavorites } from "../../services/movieField.service";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import "./Main.css";

export default function Main() {
  const [genres, setGenres] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [skeleton, setSkeleton] = useState({
    loading: true,
    content: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el, i) => <MovieSceleton key={i}/>),
  });

  useEffect(() => {
    const init = async () => {
      const res = await getAllMovies();
      if (!res) return;
      const markedMovies = await markFavorites(res);
      setGenres(getAllGenres(res));
      setTopMovies(sortByField("average_rating", markedMovies));
      setNewMovies(sortByField("year", markedMovies));
      setSkeleton({ ...skeleton, loading: false });
    };

    init();
  }, []);

  function sortByField(field: string, arr: Movie[]) {
    return arr
      .sort((curr, prev) => prev[field] - curr[field])
      .slice(0, 10)
      .map((movie) => <MovieCard key={movie.id} movie={movie}></MovieCard>);
  }

  function getAllGenres(movies): string[] {
    const genres = [];
    movies.map((movie) =>
      movie.genres.map((genre) => {
        if (!genres.includes(genre)) {
          genres.push(genre);
        }
      })
    );
    return genres;
  }

  function getCorrectNameOfGenre(genre: string): string {
    const correct = encodeURIComponent(genre).replaceAll("%CC%86", "%D0%B8");
    return decodeURIComponent(correct);
  }

  return (
    <>
      <div className="genres-container">
        {genres.length
          ? genres.map((el, index) => (
              <Link
                to={`/search?genres=${el}`}
                style={{ backgroundImage: `url(./img/${getCorrectNameOfGenre(el)}.jpg)` }}
                className="genre"
                key={index}
              >
                <span key={index}>{el}</span>
              </Link>
            ))
          : [0, 0, 0, 0, 0, 0].map((el, i) => <Skeleton key={i} variant="rounded" className="min-w-[300px]" height="100%" />)}
      </div>
      <div>
        <h1 className="mb-3">Новинки</h1>
        <AdaptiveContainer content={skeleton.loading ? skeleton.content : newMovies} />
      </div>
      <div>
        <h1 className="mb-3">Топ 10 лучших фильмов</h1>
        <AdaptiveContainer content={skeleton.loading ? skeleton.content : topMovies} />
      </div>
    </>
  );
}
