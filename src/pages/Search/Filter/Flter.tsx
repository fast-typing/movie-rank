import { Button, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { FILTER_INPUTS } from "../../../App.constants";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import { Movie } from "../../../interfaces/Interfaces";

export default function Filter({ movies, setMovies, isMovieSet, setLoading }) {
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

    useEffect(() => {
        const newFilter = { ...filter };
        for (let key of Object.keys(filter)) {
            const value = decodeURIComponent(searchParams.get(key));
            if (!value?.length) continue;
            newFilter[key] = value;
        }
        setFilter({ ...newFilter });
    }, [])

    useEffect(() => {
        if (!isMovieSet || !movies?.old?.length) return
        setLoading(true)
        let allMovies = movies.old;
        allMovies = filterByField("title", allMovies);
        allMovies = filterByField("country", allMovies);
        allMovies = filterByField("genres", allMovies);
        allMovies = filterByField("year", allMovies);
        allMovies = filterByField("age_rating", allMovies);
        setMovies({ ...movies, current: allMovies });
        setLoading(false)
    }, [filter, isMovieSet]);

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
        setMovies(sortedMovies);
        setLoading(false)
    }, [sortBy]);

    useEffect(() => {
        setFilter({ ...filter, title: decodeURIComponent(searchParams.get("title")) });
    }, [searchParams.get("title")]);

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

            return String(fieldValue).toLowerCase().includes(value.toLowerCase());
        });
    }

    function getQuery() {
        const query = {};
        window.location.toString()?.split("?")[1]?.split("&").map((el) => {
            const [key, value] = el?.split("=");
            query[key] = decodeURIComponent(value);
        });
        return query;
    }


    function handleChange(e) {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    }

    function changeSort(e) {
        setSortBy(e.target.value);
    }

    function routeToRandom() {
        const randomIndex = Math.floor(Math.random() * movies.current.length);
        const id = movies.current[randomIndex].id;
        navigate(`/movie/${id}`);
    }

    function clearFormValue() {
        setFilter({ title: "", country: "", genres: "", year: "", age_rating: "", })
    }

    return (
        <div className="grid gap-4 w-full sm:w-[300px] h-fit">
            {FILTER_INPUTS.map((el) => (
                <div className="w-full">
                    <p className="ml-2">{el.name}</p>
                    <input
                        className="w-full"
                        placeholder={el.name}
                        name={el.value}
                        onChange={handleChange}
                        value={filter[el.value]}
                    />
                </div>
            ))}
            <FormControl sx={{ width: "100%" }}>
                <InputLabel id="age">Сортировка</InputLabel>
                <Select label="Сортировка" onChange={changeSort} value={sortBy}>
                    <MenuItem value=""> <em>None</em> </MenuItem>
                    <MenuItem value={"old"}>Сначала старые</MenuItem>
                    <MenuItem value={"new"}>Сначала новые</MenuItem>
                    <MenuItem value={"rating"}>Наибольший рейтинг</MenuItem>
                </Select>
            </FormControl>
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
    )
}