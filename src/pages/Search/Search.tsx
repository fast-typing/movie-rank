import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Movie } from "../../interfaces/Interfaces";
import MovieSceleton from "../../components/MovieSkeleton";
import { getAllMovies } from "../../services/http.service";
import { markFavorites } from "../../services/movieField.service";
import Filter from "./Filter/Flter";
import { Pagination, Stack } from "@mui/material";

interface Movies {
  old: Movie[];
  current: Movie[];
}

export default function Search() {
  const [movies, setMovies] = useState({ current: null, old: null })
  const [page, setPage] = useState({ current: 1, max: 1, content: null });
  const [skeleton, setSkeleton] = useState({
    loading: true,
    skeleton: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el) => <MovieSceleton />),
  });

  useEffect(() => {
    const init = async () => {
      const res = await getAllMovies();
      if (!res) return;
      const markedMovies = await markFavorites(res)
      setMovies({ old: markedMovies, current: markedMovies })
      const jsxMovies = markedMovies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      setPage({ current: 1, max: Math.ceil(markedMovies.length / 12), content: jsxMovies.slice(0, 12) })
      setSkeleton((prev) => {
        return { ...prev, loading: false };
      });
    };

    init();
  }, []);

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const content = movies.current.slice((value - 1) * 12, value * 12);
    const jsxMovies = content.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    setPage({ ...page, current: value, content: jsxMovies });
  };

  function setLoad(value: boolean) {
    setSkeleton({ ...skeleton, loading: value })
  }

  function setMoviesByFilter(inputMovies) {
    const current = inputMovies.current
    setMovies({ ...movies, current: current })
    const jsxMovies = current?.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    setPage({ current: 1, max: Math.ceil(current?.length / 12), content: jsxMovies?.slice(0, 12) })
  }

  const pagination = (className: string) => {
    return (
      page.max > 1 ? (
        <Stack spacing={2} className={className}>
          <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
        </Stack>
      ) : null
    )
  }

  return (
    <div className="grid sm:flex gap-8">
      <Filter movies={movies} setMovies={setMoviesByFilter} setLoading={setLoad} isMovieSet={movies.old !== null} />
      <div className="w-full">
        {pagination('mb-4')}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skeleton.loading ? skeleton.skeleton : page.content?.length ? page?.content : "Пусто :("}
        </div>
        {pagination('mt-4')}
      </div>
    </div>
  );
}
