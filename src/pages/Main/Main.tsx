import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import MovieSceleton from "../../components/MovieSceleton/MovieSceleton";
import AdaptiveContainer from "../../components/AdaptiveContainer/AdaptiveContainer";
import { getAllMovies } from "../../services/http.service";
import { Movie } from "../../interfaces/Interfaces";
import "./Main.css";
import { markFavorites } from "../../services/movieField.service";
import Chip from '@mui/material/Chip';

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
    <div className="flex overflow-y-auto items-center" id="genre">
    {genre.map((element, index) => (
      <div className="flex h-[200px] items-center ml-8 mr-8 cursor-pointer">
        {/* <Chip label={element} size="medium" onClick={console.log} key={index} className="text-3xl"/> */}
        <p key={index} className="text-3xl">{element}</p>
      </div>
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
