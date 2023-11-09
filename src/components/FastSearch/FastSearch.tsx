import React, { useEffect, useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import { getAllMovies } from "../../services/http.service";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import './FastSearch.css'
import { AMOUNT_OF_MOVIES_ON_FAST_SEARCH } from "../../App.constants";

export default function FastSearch({ search, setSearch, input, setInput }) {
    const navigate = useNavigate();
    const [movies, setMovies] = useState({ current: [], old: [] });

    useEffect(() => {
        const init = async () => {
            const res = await getAllMovies();
            setMovies({ old: res, current: res.slice(0, AMOUNT_OF_MOVIES_ON_FAST_SEARCH) })
        }

        init()
    }, []);

    useEffect(() => {
        if (!search?.length) return
        const fastfilter = movies.old.filter((movie) => movie["title"].toLowerCase().includes(search.toLowerCase()))
        setMovies({ ...movies, current: fastfilter.slice(0, AMOUNT_OF_MOVIES_ON_FAST_SEARCH) })
    }, [search])

    function routeTo(movieId: number) {
        navigate(`movie/${movieId}`, { replace: true })
        setInput({ open: false, focus: false })
        setSearch('')
        setMovies({ ...movies, current: movies.old.slice(0, AMOUNT_OF_MOVIES_ON_FAST_SEARCH) })
    }

    return (
        <div className={input.focus ? "fast-search" : "hidden"}>
            {
                movies.current.length ? movies.current.map((movie: Movie) =>
                    <div key={movie.id} onClick={() => routeTo(movie.id)} className="flex cursor-pointer">
                        <img src={movie.poster} className="h-[70px] rounded mr-3" />
                        <div>
                            <h2 className="text-base two-rows-text">{movie.title}</h2>
                            <div className="text-sm flex gap-1 items-center">
                                <StarIcon sx={{ color: red[500] }} />
                                <p>{movie.average_rating}</p>
                            </div>
                        </div>
                    </div>
                ) : 'Ничего не найдено :('
            }
        </div>
    );
}