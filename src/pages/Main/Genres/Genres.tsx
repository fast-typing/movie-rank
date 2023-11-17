import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Genres({ movies }) {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        if (!movies?.length) return

        const genres = [];
        movies.map((movie) =>
            movie.genres.map((genre) => {
                if (!genres.includes(genre)) {
                    genres.push(genre);
                }
            })
        );

        setGenres(genres);
    }, [movies])

    function getCorrectNameOfGenre(genre: string): string {
        const correct = encodeURIComponent(genre).replaceAll("%CC%86", "%D0%B8");
        return decodeURIComponent(correct);
    }

    return (
        <div className="genres-container">
            {genres.length
                ? genres.map((el, i) => (
                    <Link
                        to={`/search?genres=${el}`}
                        style={{ backgroundImage: `url(./img/${getCorrectNameOfGenre(el)}.jpg)` }}
                        className="genre"
                        key={i}
                    >
                        <span>{el}</span>
                    </Link>
                ))
                : [0, 0, 0, 0, 0, 0].map((el, i) => (
                    <Skeleton key={i} variant="rounded" className="min-w-[300px]" height="100%" />
                ))}
        </div>
    )
}