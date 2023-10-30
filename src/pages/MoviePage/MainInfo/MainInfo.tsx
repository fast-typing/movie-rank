import { IconButton, Rating, ToggleButton, ToggleButtonGroup } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useEffect, useState } from "react";
import { favoriteToggle, getMovie, getUserData, markFilm } from "../../../services/http.service";
import { changeBooleanTypesOfMovies } from "../../../services/movieField.service";
import { TOGGLE_BUTTONS } from "../../../App.constants";

export default function MainInfo({ movie }) {
    const [alignment, setAlignment] = useState<"postopened" | "abandoned" | "finished" | "planned">(null);
    const [loadingButtons, setLoadingButtons] = useState<boolean>(false);
    const [favorite, setFavorite] = useState({
        isFavorite: false,
        loading: false,
    });

    useEffect(() => {
        const init = async () => {
            let resMovies = await getMovie(movie.id);
            const token = localStorage.getItem("token") ?? "";
            const user = await getUserData(token);
            if (!resMovies || !user) return;
            resMovies = changeBooleanTypesOfMovies([resMovies], user)[0];
            setFavorite({ ...favorite, isFavorite: resMovies.is_favorite });

            let alignment = null;
            if (resMovies.is_abandoned) alignment = "abandoned";
            else if (resMovies.is_planned) alignment = "planned";
            else if (resMovies.is_postponed) alignment = "postponed";
            else if (resMovies.is_finished) alignment = "finished";
            setAlignment(alignment);
        }

        init()
    }, [])

    const handleAlignment = async (event: React.MouseEvent<HTMLElement>, newAlignment: "postopened" | "abandoned" | "finished" | "planned") => {
        setLoadingButtons(true);
        const user_id = localStorage.getItem("user_id") ?? "";
        if (newAlignment === null) {
            const res = await markFilm(user_id, movie.id, alignment);
            if (res.Message) setAlignment(null);
        } else {
            const res = await markFilm(user_id, movie.id, newAlignment);
            if (res.Message) setAlignment(newAlignment);
        }
        setLoadingButtons(false);
    };

    const floatIcon = favorite.loading ? <RefreshRoundedIcon className="loading" /> :
        favorite.isFavorite ? <BookmarkIcon /> : <BookmarkBorderIcon />

    async function toggleFavorite() {
        setFavorite({ ...favorite, loading: true });
        const user_id = localStorage.getItem("user_id") ?? "";
        const res = await favoriteToggle(user_id, movie.id);
        if (res.Message) {
            setFavorite({ isFavorite: !favorite.isFavorite, loading: false });
        } else {
            setFavorite({ ...favorite, loading: false });
        }
    }

    const toggleButtons = TOGGLE_BUTTONS.map((item) => {
        return (
            <ToggleButton className="w-full grid md:w-fit md:flex" value={item.value}>
                {item.icon} <span className="ml-1 hidden md:block">{item.text}</span>
            </ToggleButton>
        );
    });

    return (
        <div className="w-full grid gap-4">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
                <h1>{movie.title}</h1>
                <div className="flex gap-1 items-center">
                    <Rating max={10} precision={0.5} defaultValue={movie.average_rating} size="large" readOnly />
                    <p className="text-lg">{movie.average_rating}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <IconButton color="primary" disabled={favorite.loading} onClick={toggleFavorite}>
                    {floatIcon}
                </IconButton>
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    disabled={loadingButtons}
                    className="w-full md:w-fit"
                >
                    {toggleButtons}
                </ToggleButtonGroup>
            </div>
        </div>
    )
}