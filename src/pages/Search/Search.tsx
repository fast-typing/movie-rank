import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Movie } from "../../interfaces/Interfaces";
import MovieSceleton from "../../components/MovieSkeleton";
import { getAllMovies } from "../../services/http.service";
import { markFavorites } from "../../services/movieField.service";
import { Button, FormControl, MenuItem, OutlinedInput, Pagination, Select, Skeleton, Stack } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AMOUNT_OF_MOVIES_ON_PAGE, FILTER_INPUTS_STR } from "../../App.constants";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import LayersClearRoundedIcon from "@mui/icons-material/LayersClearRounded";

const MenuProps = {
  autoFocus: false,
  PaperProps: {
    style: {
      height: 250,
      OverflowY: "auto",
    },
  },
}

const skeleton = (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el, i) => <MovieSceleton key={i} />)}
  </div>
)

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState({ current: null, old: null });
  const [page, setPage] = useState({ current: 1, max: 1, content: null });
  const [sortBy, setSortBy] = useState<"Старые" | "Новые" | "По рейтенгу" | "">(getQueryStringValue('sortBy') as '' | 'Старые' | 'Новые' | 'По рейтенгу');
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [ageRatings, setAgeRatings] = useState([]);
  const [loading, setLoading] = useState(3);
  const [filter, setFilter] = useState({
    title: getQueryStringValue('title'),
    year: getQueryStringValue('year'),
    age_rating: getQueryStringValue('age_rating'),
    country: getQueryArrValue('country'),
    genres: getQueryArrValue('genres'),
  });

  function getQueryStringValue(key: string): string {
    const value = decodeURIComponent(searchParams.get(key))?.replace('+', ' ')
    if (key === 'sortBy') {
      const isValueCorrect = value == 'Старые' || value == 'Новые' || value == 'По рейтенгу'
      return isValueCorrect ? value : ''
    }
    return value === 'null' ? '' : value
  }

  function getQueryArrValue(key: string): string[] {
    const value = decodeURIComponent(searchParams.get(key));
    return value === "null" ? [] : value.split(",").map(el => el.replace('+', ' '));
  }

  useEffect(() => {
    const init = async () => {
      const res = await getAllMovies();
      if (!res) return;
      const markedMovies = await markFavorites(res);
      setMovies({ old: markedMovies, current: markedMovies });
      const jsxMovies = markedMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
      setPage({ current: 1, max: Math.ceil(res.length / AMOUNT_OF_MOVIES_ON_PAGE), content: jsxMovies.slice(0, AMOUNT_OF_MOVIES_ON_PAGE), });
      initFilterVariables(res);
    };

    init();
  }, []);

  function initFilterVariables(movies: Movie[]) {
    const moviesGenres = [];
    movies.map((movie: Movie) =>
      movie.genres.map((genre) => (moviesGenres.includes(genre) ? null : moviesGenres.push(genre)))
    );
    setGenres(moviesGenres);

    const moviesCountries = [];
    movies.map((movie: Movie) =>
      movie.country.split(", ").map((el) => (moviesCountries.includes(el) ? null : moviesCountries.push(el)))
    );
    setCountries(moviesCountries);

    const moviesAgeRatings = [];
    movies.map((movie: Movie) =>
      moviesAgeRatings.includes(movie.age_rating) && movie.age_rating ? null : moviesAgeRatings.push(movie.age_rating)
    );
    setAgeRatings(moviesAgeRatings);
  }

  useEffect(() => {
    if (!movies?.old?.length) return;
    // Фильтрация при первой загрузке страницы
    let allMovies = movies.old;
    allMovies = filterByFields(["title", "year", "age_rating", "country", "genres"], filter, allMovies);
    const sortedMovies = allMovies.sort((curr, prev) => {
      switch (sortBy) {
        case "Новые": return prev.year - curr.year;
        case "Старые": return curr.year - prev.year;
        case "По рейтенгу": return prev.average_rating - curr.average_rating;
      }
    });
    setMoviesByFilter(sortedMovies)
  }, [movies.old]);

  useEffect(() => {
    setLoading((prev) => prev - 1);
  }, [page])

  function changeSearchParams(key: string, value: string) {
    setSearchParams((searchParams) => {
      const isValueEmpty = value === "" || value.length === 0
      isValueEmpty ? searchParams.delete(key) : searchParams.set(key, value)
      return searchParams;
    });
  }

  function onFilterChange(e) {
    const value = e.target.value;
    const key = e.target.name;
    const newFilter = { ...filter, [key]: value }
    setFilter(newFilter);
    changeSearchParams(key, value)
    let allMovies = movies.old;
    allMovies = filterByFields(["title", "year", "age_rating", "country", "genres"], newFilter, allMovies);
    const sortedMovies = allMovies.sort((curr, prev) => {
      switch (sortBy) {
        case "Новые": return prev.year - curr.year;
        case "Старые": return curr.year - prev.year;
        case "По рейтенгу": return prev.average_rating - curr.average_rating;
      }
    });
    setMoviesByFilter(sortedMovies)
  }

  function filterByFields(fields: string[], inputFilter: any, allMovies: Movie[]): Movie[] {
    fields.map(field => {
      const filterValue = inputFilter[field];
      if (!filterValue?.length) return allMovies;

      allMovies = allMovies.filter((movie) => {
        if (field == 'genres' || field == 'country') {
          const movieValue = movie[field];
          return filterValue.filter((el) => movieValue.includes(el)).length === filterValue.length ? movieValue : null;
        } else {
          const movieValue = typeof movie[field] == "object" ? movie[field]?.join(" ") : movie[field];
          if (field === "age_rating") {
            return movieValue === filterValue;
          }
          return String(movieValue).toLowerCase().includes(filterValue.toLowerCase());
        }
      });
    })

    return allMovies
  }

  function onSortChange(e) {
    const value = e.target.value
    setSortBy(value);
    changeSearchParams('sortBy', value)
    if (!movies.current) return
    const sortedMovies = movies.current.sort((curr, prev) => {
      switch (value) {
        case "Новые": return prev.year - curr.year;
        case "Старые": return curr.year - prev.year;
        case "По рейтенгу": return prev.average_rating - curr.average_rating;
      }
    });
    setMoviesByFilter(sortedMovies);
  }

  function setMoviesByFilter(inputMovies) {
    setMovies({ ...movies, current: inputMovies });
    const jsxMovies = inputMovies?.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    setPage({
      current: 1,
      max: Math.ceil(inputMovies?.length / AMOUNT_OF_MOVIES_ON_PAGE),
      content: jsxMovies?.slice(0, AMOUNT_OF_MOVIES_ON_PAGE),
    });
  }

  function clearFormValue() {
    setFilter({ title: "", year: "", age_rating: '', country: [], genres: [] });
    setMovies({ ...movies, current: movies.old });
    setSearchParams("");
    setSortBy("");
  }

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const content = movies.current.slice((value - 1) * AMOUNT_OF_MOVIES_ON_PAGE, value * AMOUNT_OF_MOVIES_ON_PAGE);
    const jsxMovies = content.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    setPage({ ...page, current: value, content: jsxMovies });
  };

  function routeToRandom() {
    const randomIndex = Math.floor(Math.random() * movies.current.length);
    const id = movies.current[randomIndex].id;
    navigate(`/movie/${id}`);
  }

  const pagination = () => {
    return page.max > 1 ? (
      <Stack spacing={1} >
        <Pagination size="large" count={page.max} page={page.current} onChange={changePage} />
      </Stack>
    ) : null;
  };

  return (
    <div className="grid sm:flex gap-8">
      <form className="top-[24px] sm:sticky grid gap-4 w-full sm:w-[260px] h-fit">
        {FILTER_INPUTS_STR.map((input) => (
          <div key={input.value} className="w-full">
            <p className="ml-2">{input.name}</p>
            <input
              disabled={loading > 0}
              className="w-full"
              placeholder={input.name}
              name={input.value}
              onChange={onFilterChange}
              value={filter[input.value]}
            />
          </div>
        ))}
        <div className="w-full">
          <p className="ml-2">Жанры</p>
          <FormControl size="small" className="w-full md:max-w-[208px]">
            <Select
              input={<OutlinedInput />}
              renderValue={(selected) =>
                selected.length === 0 ? <span style={{ color: "rgb(150, 150, 150)" }}>Жанры</span> : selected.join(", ")
              }
              inputProps={{ "aria-label": "Without label" }}
              displayEmpty
              multiple
              size="small"
              MenuProps={MenuProps}
              name="genres"
              onChange={onFilterChange}
              value={filter["genres"]}
            >
              {genres
                ? genres.map((el) => {
                  return <MenuItem key={el} value={el}>{el}</MenuItem>;
                })
                : null}
            </Select>
          </FormControl>
        </div>
        <div className="w-full">
          <p className="ml-2">Страна</p>
          <FormControl className="w-full md:max-w-[208px]" size="small">
            <Select
              input={<OutlinedInput />}
              renderValue={(selected) =>
                selected.length === 0 ? (
                  <span style={{ color: "rgb(150, 150, 150)" }}>Страна</span>
                ) : (
                  selected.join(", ")
                )
              }
              inputProps={{ "aria-label": "Without label" }}
              displayEmpty
              multiple
              size="small"
              MenuProps={MenuProps}
              name="country"
              onChange={onFilterChange}
              value={filter["country"]}
            >
              {countries
                ? countries.map((el) => {
                  return <MenuItem key={el} value={el}>{el}</MenuItem>;
                })
                : null}
            </Select>
          </FormControl>
        </div>
        <div className="w-full">
          <p className="ml-2">Возраст</p>
          <FormControl size="small" className="w-full md:max-w-[208px]">
            <Select
              input={<OutlinedInput />}
              renderValue={(selected) =>
                selected.length === 0 ? (
                  <span style={{ color: "rgb(150, 150, 150)" }}>Возраст</span>
                ) : selected
              }
              inputProps={{ "aria-label": "Without label" }}
              displayEmpty
              size="small"
              MenuProps={MenuProps}
              name="age_rating"
              onChange={onFilterChange}
              value={filter["age_rating"]}
            >
              <MenuItem value={""}>
                <em>Пусто</em>
              </MenuItem>
              {ageRatings
                ? ageRatings.map((el) => {
                  return <MenuItem key={el} value={el}>{el}</MenuItem>;
                })
                : null}
            </Select>
          </FormControl>
        </div>
        <div className="w-full">
          <p className="ml-2">Сортировка</p>
          <FormControl size="small" className="w-full md:max-w-[208px]">
            <Select
              input={<OutlinedInput />}
              renderValue={(selected) =>
                selected.length === 0 ? <span style={{ color: "rgb(150, 150, 150)" }}>Сортировка</span> : selected
              }
              inputProps={{ "aria-label": "Without label" }}
              displayEmpty
              size="small"
              label="Сортировка"
              onChange={onSortChange}
              value={sortBy}
            >
              <MenuItem value={""}>
                <em>Пусто</em>
              </MenuItem>
              <MenuItem value={"Старые"}>Сначала старые</MenuItem>
              <MenuItem value={"Новые"}>Сначала новые</MenuItem>
              <MenuItem value={"По рейтенгу"}>Наибольший рейтинг</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button startIcon={<LayersClearRoundedIcon />} className="w-full" onClick={clearFormValue} variant="contained">
          Очистить фильтр
        </Button>
        <Button
          className="w-full"
          onClick={routeToRandom}
          disabled={!movies?.current?.length}
          startIcon={<CasinoRoundedIcon />}
          variant="contained"
        >
          Случайный фильм
        </Button>
      </form>
      <div className="w-full">
        {loading > 0
          ? skeleton
          : page.content.length
            ? <>
              {pagination()}
              <div className="my-4 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading > 0 ? skeleton : page.content.length ? page.content : "Пусто :("}
              </div>
              {pagination()}
            </>
            : "Пусто :("}
      </div>
    </div>
  );
}
