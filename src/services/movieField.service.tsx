import { Movie, User } from "../interfaces/Interfaces"
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

export function changeBooleanTypesOfMovies(movies: Movie[], user: User): Movie[] {
    let newMoviesArr = movies
    if (!user) return []
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_abandoned', 'abandoned_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_planned', 'planned_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_favorite', 'favorite_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_postponed', 'postponed_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_finished', 'finished_films')
    return newMoviesArr
}

function changeMovieField(movies: Movie[], user: User, movieField: string, userField: string): Movie[] {
    return movies.map((movie) => {
        return {
            ...movie,
            [movieField]: !!user[userField]?.filter((filter_movie: Movie) => filter_movie.id === movie.id).length
        }
    })
}