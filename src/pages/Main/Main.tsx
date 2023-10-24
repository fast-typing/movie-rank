import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import MovieSceleton from "../../components/MovieSceleton/MovieSceleton";
import AdaptiveContainer from "../../components/AdaptiveContainer/AdaptiveContainer";
import { getAllMovies } from "../../services/http.service";
import { Movie } from "../../interfaces/Interfaces";
import "./Main.css";
import { markFavorites } from "../../services/favorite.service";

export default function Main() {
  const [topMovies, setTopMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [skeleton, setSkeleton] = useState({
    loading: true,
    content: (
      <>
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
        <MovieSceleton />
      </>
    ),
  });

  useEffect(() => {
    const init = async () => {
      const res = await getAllMovies();
      if (!res) return;
      const markedMovies = await markFavorites(res)
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

  return (
    <>
      <div>
        <h1 className="mb-3">Топ 10 лучших фильмов</h1>
        <AdaptiveContainer
          content={skeleton.loading ? skeleton.content : topMovies}
        />
      </div>
      <div>
        <h1 className="mb-3">Новинки</h1>
        <AdaptiveContainer
          content={skeleton.loading ? skeleton.content : newMovies}
        />
      </div>
    </>
  );
}
