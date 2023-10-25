import { Movie } from "../interfaces/Interfaces"
import { getUserData } from "./http.service"

export async function markFavorites(movies: Movie[]) {
    const token = localStorage.getItem('token')
    if (!token?.length) return movies
    const user = await getUserData(token)
    if (!user) return movies
    return movies.map((movie) => {
        return {
            ...movie,
            is_favorite: !!user.favorite_films?.filter((fil_movie: Movie) => fil_movie.id === movie.id)?.length ?? false
        }
    })
}