import { FormControl, IconButton, InputLabel, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Movie } from "../../interfaces/Interfaces";
import Select from "@mui/material/Select";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import { useNavigate, useSearchParams } from "react-router-dom";
import MovieSceleton from "../../components/MovieSceleton/MovieSceleton";
import AdaptiveContainer from "../../components/AdaptiveContainer/AdaptiveContainer";
import { getAllMovies } from "../../services/http.service";
import { MPAARatingC, filterInputsC } from "../../App.constants";

interface Movies {
  old: Movie[];
  current: Movie[];
}

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<"old" | "new" | "rating">("old");
  const [filter, setFilter] = useState({
    title: "",
    country: "",
    genres: "",
    year: "",
    age_rating: "",
  });
  const [movies, setMovies] = useState<Movies>({ old: [], current: [] });
  const [skeleton, setSkeleton] = useState({
    loading: true,
    skeleton: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el) => <MovieSceleton />),
  });

  useEffect(() => {
    const init = async () => {
      const res = await getAllMovies();
      if (!res) return;
      setMovies({ old: res, current: res });

      const newFilter = { ...filter };
      for (let key of Object.keys(filter)) {
        const value = searchParams.get(key);
        if (!value?.length) continue;
        newFilter[key] = value;
      }
      setFilter({ ...newFilter });

      setSkeleton((prev) => {
        return { ...prev, loading: false };
      });
    };

    init();
  }, []);

  useEffect(() => {
    console.log(filter)
    if (!movies.old.length) return;
    setSkeleton({ ...skeleton, loading: true })
    let allMovies = movies.old;
    allMovies = filterByField("title", allMovies);
    allMovies = filterByField("country", allMovies);
    allMovies = filterByField("genres", allMovies);
    allMovies = filterByField("year", allMovies);
    allMovies = filterByField("age_rating", allMovies);
    setMovies({ ...movies, current: allMovies });
    setSkeleton({ ...skeleton, loading: false })
  }, [filter]);

  useEffect(() => {
    setFilter({ ...filter, title: searchParams.get("title") });
  }, [searchParams.get("title")]);

  useEffect(() => {
    if (!movies.current.length) return;
    setSkeleton({ ...skeleton, loading: true });
    const sortedMovies = movies.current.sort((curr, prev) => {
      switch (sortBy) {
        case "new":
          return prev.year - curr.year;
        case "old":
          return curr.year - prev.year;
        case "rating":
          return prev.average_rating - curr.average_rating;
      }
    });
    setMovies({ ...movies, current: sortedMovies });
    setSkeleton({ ...skeleton, loading: false });
  }, [sortBy]);

  function filterByField(field: string, allMovies: Movie[]): Movie[] {
    const value = filter[field];

    if (value !== searchParams.get(field)) {
      setSearchParams({ ...getQuery(), [field]: value });
    }

    if (!value?.length) return allMovies;

    return allMovies.filter((movie) => {
      let fieldValue = movie[field];
      if (typeof movie[field] === "object") {
        fieldValue = fieldValue.join(" ");
      }

      if (field == 'age_rating') {
        return String(fieldValue).toLowerCase() === value;
      }

      return String(fieldValue).toLowerCase().includes(value);
    });
  }

  function getQuery() {
    const query = {};
    window.location
      .toString()
      ?.split("?")[1]
      ?.split("&")
      .map((el) => {
        const [key, value] = el?.split("=");
        query[key] = decodeURI(value);
      });
    return query;
  }

  // !!! ФИЛЬТР ПО ДАТЕ, РЕЙТЕНГУ

  function handleChange(e) {
    setFilter({ ...filter, [e.target.name]: e.target.value.toLowerCase() });
  }

  function changeSort(e) {
    setSortBy(e.target.value);
  }

  function routeToRandom() {
    const randomIndex = Math.floor(Math.random() * movies.current.length);
    const id = movies.current[randomIndex].id;
    navigate(`/movie/${id}`);
  }

  return (
    <div>
      <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-8 items-center">
        {filterInputsC.map((el) => (
          <input
            className="w-full"
            placeholder={el.name}
            name={el.value}
            onChange={handleChange}
            value={filter[el.value]}
          />
        ))}
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="age">MPAA</InputLabel>
          <Select
            name="age_rating"
            label="MPAA"
            onChange={handleChange}
            value={filter.age_rating}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {MPAARatingC.map((el) => (
              <MenuItem value={el.value.toLowerCase()}>{el.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="age">Сортировка</InputLabel>
          <Select label="Сортировка" onChange={changeSort} value={sortBy}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"old"}>Сначала старые</MenuItem>
            <MenuItem value={"new"}>Сначала новые</MenuItem>
            <MenuItem value={"rating"}>Наибольший рейтинг</MenuItem>
          </Select>
        </FormControl>
        <IconButton
          size="large"
          sx={{ height: "fit-content" }}
          onClick={routeToRandom}
          disabled={!movies.current.length}
          color="primary"
        >
          <CasinoRoundedIcon />
        </IconButton>
      </div>
      <AdaptiveContainer
        content={
          skeleton.loading
            ? skeleton.skeleton
            : movies.current.length
              ? movies.current.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
              : "Пусто :("
        }
      />
    </div>
  );
}
