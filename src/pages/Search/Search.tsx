import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Movie } from "../../interfaces/Interfaces";
import MovieSceleton from "../../components/MovieSkeleton";
import { getAllMovies } from "../../services/http.service";
import { markFavorites } from "../../services/movieField.service";
import { Button, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Pagination, Select, Stack, makeStyles } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AMOUNT_OF_MOVIES_ON_PAGE, FILTER_INPUTS } from "../../App.constants";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";

const MenuProps = {
  autoFocus: false,
  PaperProps: {
    style: {
      height: 250,
      OverflowY: "auto"
    }
  }
};

export default function Search() {
  const navigate = useNavigate();
  const skeleton = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el) => <MovieSceleton />)
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState({ current: null, old: null })
  const [page, setPage] = useState({ current: 1, max: 1, content: null });
  const [sortBy, setSortBy] = useState<"old" | "new" | "rating" | "">("");
  const [genres, setGenres] = useState([])
  const [countries, setCountries] = useState([])
  const [ageRatings, setAgeRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    title: "",
    year: "",
    country: "",
    genres: "",
    age_rating: "",
  });

  useEffect(() => {
    const init = async () => {
      const res = await getAllMovies();
      if (!res) return;
      const markedMovies = await markFavorites(res)
      setMovies({ old: markedMovies, current: markedMovies })

      const jsxMovies = markedMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      setPage({ current: 1, max: Math.ceil(res.length / AMOUNT_OF_MOVIES_ON_PAGE), content: jsxMovies.slice(0, AMOUNT_OF_MOVIES_ON_PAGE) })
      setLoading(false);
      initFilter(res)
    };

    init();
  }, []);

  function initFilter(movies: Movie[]) {
    const newFilter = { ...filter };
    for (let key of Object.keys(filter)) {
      const decoded = decodeURIComponent(searchParams.get(key))
      const value = decoded == 'null' ? '' : decoded;
      if (!value?.length) continue;
      newFilter[key] = value;
    }
    setFilter({ ...newFilter });

    const moviesGenres = []
    movies.map((movie: Movie) => {
      movie.genres.map(genre => moviesGenres.includes(genre) ? null : moviesGenres.push(genre))
    })
    setGenres(moviesGenres)

    const moviesCountries = []
    movies.map((movie: Movie) => {
      movie.country.split(', ').map(el => moviesCountries.includes(el) ? null : moviesCountries.push(el))
    })
    setCountries(moviesCountries)

    const moviesAgeRatings = []
    movies.map((movie: Movie) => moviesAgeRatings.includes(movie.age_rating) ? null : moviesAgeRatings.push(movie.age_rating))
    setAgeRatings(moviesAgeRatings)
  }

  useEffect(() => {
    const getStringValue = (field: string): string => {
      const value = decodeURIComponent(searchParams.get(field))
      return value === 'null' ? '' : value
    }

    setFilter({
      ...filter,
      title: getStringValue('title').replace('+', ' '),
      year: getStringValue('year'),
      country: getStringValue('country'),
      genres: getStringValue('genres'),
      age_rating: getStringValue('age_rating')
    });
  }, [searchParams.get("title"), searchParams.get("country"), searchParams.get("genres"), searchParams.get("year"), searchParams.get("age_rating")]);

  useEffect(() => {
    if (!movies?.old?.length) return
    setLoading(true)
    let allMovies = movies.old;
    allMovies = filterByField("title", allMovies);
    allMovies = filterByField("country", allMovies);
    allMovies = filterByField("genres", allMovies);
    allMovies = filterByField("year", allMovies);
    allMovies = filterByField("age_rating", allMovies);
    setMoviesByFilter(allMovies);
    setLoading(false)
  }, [filter]);

  useEffect(() => {
    if (!movies?.current?.length) return;
    setLoading(true)
    const sortedMovies = movies.current.sort((curr, prev) => {
      switch (sortBy) {
        case "new": return prev.year - curr.year;
        case "old": return curr.year - prev.year;
        case "rating": return prev.average_rating - curr.average_rating;
      }
    });
    setMoviesByFilter(sortedMovies);
    setLoading(false)
  }, [sortBy]);

  function filterByField(field: string, allMovies: Movie[]): Movie[] {
    const filterValue = filter[field];

    if (!filterValue?.length) return allMovies;
    return allMovies.filter((movie) => {
      let movieValue = typeof movie[field] == "object" ? movie[field].join(' ') : movie[field];

      if (field == 'age_rating') {
        return movieValue == filterValue;
      }

      return String(movieValue).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  function routeToRandom() {
    const randomIndex = Math.floor(Math.random() * movies.current.length);
    const id = movies.current[randomIndex].id;
    navigate(`/movie/${id}`);
  }

  function onFilterChange(e) {
    const value = e.target.value
    const key = e.target.name
    setSearchParams(searchParams => {
      if (value === '') {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
      return searchParams;
    });
    setFilter({ ...filter, [key]: value });
  }

  function onSortChange(e) {
    setSortBy(e.target.value);
  }

  function clearFormValue() {
    setFilter({ title: "", year: "", country: '', genres: '', age_rating: '', })
    setSortBy("")
    setMovies({...movies, current: movies.old})
    for (const key of Object.keys(filter)) {
      searchParams.delete(key)
    }
    setSearchParams(searchParams)
  }

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const content = movies.current.slice((value - 1) * AMOUNT_OF_MOVIES_ON_PAGE, value * AMOUNT_OF_MOVIES_ON_PAGE);
    const jsxMovies = content.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    setPage({ ...page, current: value, content: jsxMovies });
  };

  function setMoviesByFilter(inputMovies) {
    setMovies({ ...movies, current: inputMovies })
    const jsxMovies = inputMovies?.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    setPage({ current: 1, max: Math.ceil(inputMovies?.length / AMOUNT_OF_MOVIES_ON_PAGE), content: jsxMovies?.slice(0, AMOUNT_OF_MOVIES_ON_PAGE) })
  }

  const pagination = (className: string) => {
    return (page.max > 1 ? (
      <Stack spacing={2} className={className}>
        <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
      </Stack>
    ) : null)
  }

  return (
    <div className="grid sm:flex gap-8">
      <div className="grid gap-4 w-full sm:w-[300px] h-fit">
        {FILTER_INPUTS.map((el) => (
          <div className="w-full">
            <p className="ml-2">{el.name}</p>
            <input className="w-full" placeholder={el.name} name={el.value} onChange={onFilterChange} value={filter[el.value]} />
          </div>
        ))}
        <div className="w-full">
          <p className="ml-2">Страна</p>
          <FormControl size="small" sx={{ width: "100%" }}>
            <Select input={<OutlinedInput />} renderValue={(selected) => selected.length === 0 ? <span style={{ color: "rgb(150, 150, 150)" }}>Страна</span> : selected} inputProps={{ 'aria-label': 'Without label' }} displayEmpty size="small" MenuProps={MenuProps} name="country" onChange={onFilterChange} value={filter['country']}>
              <MenuItem value={''}><em>Пусто</em></MenuItem>
              {countries ? countries.map(el => {
                return <MenuItem value={el}>{el}</MenuItem>
              }) : null}
            </Select>
          </FormControl>
        </div>

        <div className="w-full">
          <p className="ml-2">Жанры</p>
          <FormControl size="small" sx={{ width: "100%" }}>
            <Select input={<OutlinedInput />} renderValue={(selected) => selected.length === 0 ? <span style={{ color: "rgb(150, 150, 150)" }}>Жанры</span> : selected} inputProps={{ 'aria-label': 'Without label' }} displayEmpty size="small" MenuProps={MenuProps} name="genres" onChange={onFilterChange} value={filter['genres']}>
              <MenuItem value={''}><em>Пусто</em></MenuItem>
              {genres ? genres.map(el => {
                return <MenuItem value={el}>{el}</MenuItem>
              }) : null}
            </Select>
          </FormControl>
        </div>

        <div className="w-full">
          <p className="ml-2">Возраст</p>
          <FormControl size="small" sx={{ width: "100%" }}>
            <Select input={<OutlinedInput />} renderValue={(selected) => selected.length === 0 ? <span style={{ color: "rgb(150, 150, 150)" }}>Возраст</span> : selected} inputProps={{ 'aria-label': 'Without label' }} displayEmpty size="small" MenuProps={MenuProps} name="age_rating" onChange={onFilterChange} value={filter['age_rating']}>
              <MenuItem value={''}><em>Пусто</em></MenuItem>
              {ageRatings ? ageRatings.map(el => {
                return <MenuItem value={el}>{el}</MenuItem>
              }) : null}
            </Select>
          </FormControl>
        </div>

        <div className="w-full">
          <p className="ml-2">Сортировка</p>
          <FormControl size="small" sx={{ width: "100%" }}>
            <Select input={<OutlinedInput />} renderValue={(selected) => selected.length === 0 ? <span style={{ color: "rgb(150, 150, 150)" }}>Сортировка</span> : selected} inputProps={{ 'aria-label': 'Without label' }} displayEmpty size="small" label="Сортировка" onChange={onSortChange} value={sortBy}>
              <MenuItem value={''}><em>Пусто</em></MenuItem>
              <MenuItem value={"old"}>Сначала старые</MenuItem>
              <MenuItem value={"new"}>Сначала новые</MenuItem>
              <MenuItem value={"rating"}>Наибольший рейтинг</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex items-center gap-2 justify-between">
          <Button onClick={clearFormValue} variant="contained">Очистить</Button>
          <IconButton
            size="large"
            sx={{ height: "fit-content" }}
            onClick={routeToRandom}
            disabled={!movies?.current?.length}
            color="primary"
          >
            <CasinoRoundedIcon />
          </IconButton>
        </div>
      </div>
      <div className="w-full">
        {pagination('mb-4')}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? skeleton : page.content.length ? page.content : "Пусто :("}
        </div>
        {pagination('mt-4')}
      </div>
    </div>
  );
}
