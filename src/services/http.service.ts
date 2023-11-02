import { environment } from "../enviroment/environment";
import { Movie, Review, Registration, User } from "../interfaces/Interfaces";

export function login(data) {
  return _request(`login?username=${data.username}&password=${data.password}`, "POST");
}

export function registration(data): Promise<Registration> {
  return _request(`registration`, "POST", data);
}

export function getAllMovies(): Promise<Movie[]> {
  return _request(`get_all_films?limit=500`, "GET");
}

export function getMovie(id: string): Promise<Movie> {
  return _request(`get_film?film_id=${id}`, "GET");
}

export function getReviews(movieId: string): Promise<Review[]> {
  return _request(`get_all_reviews?film_id=${movieId}`, "GET");
}

export function getUserData(token: string): Promise<User> {
  return _request(`get_user?token=${token}`, "GET");
}

export function createReview(token: string, review: any): Promise<Review> {
  return _request(`create_review?token=${token}`, "POST", review);
}

export function markFilm(token: string, film_id: number, type: "postopened" | "abandoned" | "finished" | "planned") {
  return _request(`update_user_list?token=${token}&film_id=${film_id}&list_type=${type}`, "PATCH");
}

export function favoriteToggle(token: string, film_id: number) {
  return _request(`update_user_list?token=${token}&film_id=${film_id}&list_type=favorite`, "PATCH");
}

export function rateReview(user_id: string, review_id: number, action: "like" | "dislike") {
  return _request(`rate_review?user_id=${user_id}&review_id=${review_id}&action=${action}`, "PATCH");
}

export function createComment(token: string, body: any) {
  return _request(`create_comment?token=${token}`, "POST", body);
}

export function getAllComments(film_id: string) {
  return _request(`get_all_comments?film_id=${film_id}`, "GET");
}

export async function getCoordinates(address: string) {
  // return fetch(`https://geocode-maps.yandex.ru/1.x/?lang=ru_RU&apikey=${environment.yandexApiKey}&geocode=${address}&format=json`);
  const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${environment.yandexApiKey}&geocode=${address}&format=json`;
  return await fetch(url)
    .then((response) => response.json())
    .then((res) => res)
    .catch((error) => console.error(error));
}

export async function getUserIP() {
  return await fetch("https://ipapi.co/json")
    .then((response) => response.json())
    .then((res) => res)
    .catch((error) => console.error(error));
}

async function _request(path: string, method: string, body?: any) {
  const url = "http://213.171.9.36/" + path;
  const options = { method: method };
  if (body) {
    options["body"] = JSON.stringify(body);
    options["headers"] = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  return await fetch(url, options)
    .then((response) => response.json())
    .then((res) => res)
    .catch((error) => console.error(error));
}
