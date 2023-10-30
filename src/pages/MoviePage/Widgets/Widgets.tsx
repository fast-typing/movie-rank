import { IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useEffect, useState } from "react";
import { favoriteToggle, markFilm } from "../../../services/http.service";
import { TOGGLE_BUTTONS } from "../../../App.constants";

export default function Widgets({ movie }) {
    const [alignment, setAlignment] = useState<"postopened" | "abandoned" | "finished" | "planned">(null);
    const [loadingButtons, setLoadingButtons] = useState<boolean>(false);
    const [favorite, setFavorite] = useState({ isFavorite: movie.is_favorite, loading: false, });

    useEffect(() => {
        let alignment = null;
        if (movie.is_abandoned) alignment = "abandoned";
        else if (movie.is_planned) alignment = "planned";
        else if (movie.is_postponed) alignment = "postponed";
        else if (movie.is_finished) alignment = "finished";
        setAlignment(alignment);
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
    )
}