import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import MovieSceleton from "../../components/MovieSceleton/MovieSceleton";
import AdaptiveContainer from "../../components/AdaptiveContainer/AdaptiveContainer";
import { getAllMovies } from "../../services/http.service";
import { Movie } from "../../interfaces/Interfaces";
import "./Main.css";
import { markFavorites } from "../../services/movieField.service";
import Chip from '@mui/material/Chip';
import { Link } from "react-router-dom";

export default function Main() {
  const[genre,setGenre] = useState([]);
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
      Genre(res)
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
  function Genre(mov){
      const genres = mov.map(movie => movie.genres).flat();
      const repl = genres.map((element) => {
        return element.replace(' ', '');
      });
      const allgenre = repl.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      setGenre(allgenre)
  }

  return (
    <>
    <div className="flex overflow-y-auto items-center gap-10 h-[285px] p-5 md:p-0 md:gap-5" id="genres">
    {genre.map((element, index) => (
      <Link to={`/search?genres=${element}`} className="flex items-center cursor-pointer h-full relative">
       <img src={`./img/${element.replace("й","и")}.jpg`} className="w-full h-full brightness-[0.6] absolute rounded-lg hover:brightness-[0.4] hover:scale-[1.1] duration-300"/>
        <h2 key={index} className="text-center text-4xl w-[300px] relative">{element}</h2>
      </Link>
      ))}
      </div>
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
