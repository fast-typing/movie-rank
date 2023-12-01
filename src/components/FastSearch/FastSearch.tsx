import { useEffect, useState } from "react";
import { getFilmsByName } from "../../services/http.service";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import { AMOUNT_OF_MOVIES_ON_FAST_SEARCH, CLOSED_INPUT_STYLE, OPENED_INPUT_STYLE } from "../../App.constants";
import { CircularProgress, IconButton } from "@mui/material";
import { useDebounce } from "../../hooks/useDebounce";
import StarIcon from '@mui/icons-material/Star';
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import './FastSearch.css'

export default function FastSearch({ isMobile, toggleSideBar }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [input, setInput] = useState({ open: false, focus: false });
    const [movies, setMovies] = useState({ current: [], old: [] });
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce<string>(search)
    const inputStyle = isMobile ? { width: "100%" } : input.open ? OPENED_INPUT_STYLE : CLOSED_INPUT_STYLE;

    useEffect(() => {
        setLoading(true)
        const getFilms = async () => {
            const resMovies = await getFilmsByName(search)
            const fastfilter = resMovies.filter((movie) => movie["title"].toLowerCase().includes(search.toLowerCase()))
            setMovies({ ...movies, current: fastfilter.slice(0, AMOUNT_OF_MOVIES_ON_FAST_SEARCH) })
            setLoading(false)
        }
        getFilms()
    }, [debouncedSearch])

    function findBySearch(event: any, isMobile: boolean) {
        event.preventDefault();
        const path = search.length ? `/search?title=${search}` : '/search'
        routeTo(path);
        resetValues()
        if (isMobile) { toggleSideBar(); }
    }

    function closeInput(): void {
        if (search.length) return;
        setTimeout(() => {
            setInput({ focus: false, open: false });
        }, 100)
    }

    function routeTo(path: string, isMobile?: boolean) {
        navigate(path, { replace: true });
        resetValues()
        if (isMobile) { toggleSideBar(); }
    }

    function onSearchClick(e) {
        if (input.open === true) {
            findBySearch(e, isMobile);
        } else {
            setInput({ ...input, open: true });
        }
    }

    function resetValues() {
        setInput({ open: false, focus: false })
        setSearch("")
    }

    return (
        <form onSubmit={(e) => findBySearch(e, isMobile)} className="pseudo-input">
            {isMobile
                ? null
                : <div className={input.open && input.focus ? "fast-search" : "hidden"}>
                    {
                        loading
                            ? <div className="text-center"><CircularProgress /></div>
                            : movies.current.length ? movies.current.map((movie: Movie) =>
                                <div key={movie.id} onClick={() => routeTo(`movie/${movie.id}`)} className="flex cursor-pointer">
                                    <img loading="lazy" src={movie.poster} className="h-[70px] rounded mr-3" />
                                    <div>
                                        <h2 className="text-base two-rows-text">{movie.title}</h2>
                                        <div className="text-sm flex gap-1 items-center">
                                            <StarIcon sx={{ color: red[500] }} />
                                            <p>{movie.average_rating}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : 'Ничего не найдено'
                    }
                </div>}
            <span className="material-symbols-outlined z-1" onClick={(e) => onSearchClick(e)}>
                search
            </span>
            <input
                value={search}
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setInput({ open: true, focus: true })}
                onBlur={closeInput}
                placeholder="Найти..."
                style={inputStyle}
            />
            {isMobile ? (
                <IconButton onClick={toggleSideBar}>
                    <CloseRoundedIcon />
                </IconButton>
            ) : null}
        </form>
    );
}