import { createContext, useContext, useEffect, useState } from "react";
import { Movie, User } from "../interfaces/Interfaces";
import { getUserData } from "../services/http.service";

type UserContextType = {
    user: User | null; // флаг, показывающий, аутентифицирован ли пользователь
    setUser: (user: User) => void; // функция для изменения значения isAuth
};

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

// Функиця возвращающая 
export function changeBooleanTypesOfMovies(movies: Movie[], user: User): Movie[] {
    let newMoviesArr = movies
    if (!user) return []
    // console.log(changeMovieField(newMoviesArr, user, 'is_abandoned', 'abandoned_films'))
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_abandoned', 'abandoned_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_planned', 'planned_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_favorite', 'favorite_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_postponed', 'postponed_films')
    newMoviesArr = changeMovieField(newMoviesArr, user, 'is_finished', 'finished_films')
    return newMoviesArr
}

function changeMovieField(movies: Movie[], user: User, movieField: string, userField: string): Movie[] {
    return movies.map((movie) => {
        // console.log(movie)
        return {
            ...movie,
            [movieField]: !!user[userField]?.filter((filter_movie: Movie) => filter_movie.id === movie.id).length
        }
    })
}

export const UserProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token')
            if (!token?.length) return
            const resUser = await getUserData(token)
            if (!resUser) return
            setUser(resUser)
        }

        init()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};