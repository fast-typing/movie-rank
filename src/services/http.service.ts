import { Movie, Review, Registration, User } from "../interfaces/Interfaces";

export function login(data) {
    return _request(`login?username=${data.username}&password=${data.password}`, 'POST')
}

export function registration(data): Promise<Registration | void> {
    return _request(`registration`, 'POST', data)
}

export function getAllMovies(): Promise<Movie[] | void> {
    return _request(`get_all_films`, 'GET')
}

export function markFilm(user_id: string, film_id: number, type: "postopened" | "abandoned" | "finished" | "planned") {
    return _request(`update_user_list?user_id=${user_id}&film_id=${film_id}&list_type=${type}`, 'PATCH')
}

export function favoriteToggle(user_id: string, film_id: number) {
    return _request(`update_user_list?user_id=${user_id}&film_id=${film_id}&list_type=favorite`, 'PATCH')
}

export function getMovie(id: string): Promise<Movie | void> {
    return _request(`get_film?film_id=${id}`, 'GET')
}

export function getReviews(movieId: string): Promise<Review[] | void> {
    return _request(`get_all_reviews?film_id=${movieId}`, 'GET')
}

export function getUserData(token: string): Promise<User | void> {
    return _request(`get_user?token=${token}`, 'GET')
}

async function _request(path: string, method: string, body?: any) {
    const url = 'https://dvigit.onrender.com/' + path
    const options = { method: method, }
    if (body) {
        options['body'] = JSON.stringify(body)
        options['headers'] = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    return await fetch(url, options)
        .then((response) => response.json())
        .then((res) => res)
        .catch((error) => console.error(error));
}