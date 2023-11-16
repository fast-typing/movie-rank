import { HTTP_URL } from "../App.constants";
import { Movie, Review, Registration, User, CinemaMovie } from "../interfaces/Interfaces";

interface RateFilm {
  user_id: string;
  rating: number;
  film_id: number;
}

export function login(data) {
  return _request(`login?username=${data.username}&password=${data.password}`, "POST");
}

export function registration(data): Promise<Registration> {
  return _request(`registration`, "POST", data);
}

export function getAllMovies(): Promise<Movie[]> {
  return _request(`get_all_films?limit=99999`, "GET");
}

export function getMovie(id: string): Promise<Movie> {
  return _request(`get_film?film_id=${id}`, "GET");
}

export function getUserData(token?: string, username?: string): Promise<User> {
  let path = "get_user";
  if (token) path += `?token=${token}`;
  if (username) path += `?username=${username}`;
  return _request(path, "GET");
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

export function rateReview(user_id: string, review_id: number, action: "like" | "dislike"): Promise<Review> {
  return _request(`rate_review?user_id=${user_id}&review_id=${review_id}&action=${action}`, "PATCH");
}

export function createComment(body: any, token?: string) {
  let url = 'create_comment'
  if (token) url += `?token=${token}`
  return _request(url, "POST", body);
}

export function getAllComments(film_id: string) {
  return _request(`get_all_comments?film_id=${film_id}&limit=99999`, "GET");
}

export function getReplies(parent_review_id?: number, parent_comment_id?: number) {
  let url = `get_all_replies?`;
  if (parent_review_id) url += `parent_review_id=${parent_review_id}`;
  if (parent_comment_id) url += `parent_comment_id=${parent_comment_id}`;
  return _request(url, "GET");
}

export function getReviews(movieId: string, amount: number = 3, start?: number): Promise<Review[]> {
  let url = `get_all_reviews?film_id=${movieId}&limit=${amount}`;
  if (start) url += `&offset=${start}`;
  return _request(url, "GET");
}

export function rateFilm(body: RateFilm) {
  return _request(`rate_the_film`, "POST", body);
}

export function getRecommendations(user_id: string) {
  return _request(`get_recommendations?user_id=${user_id}`, "GET");
}

export function getCinemasByCity(city_id: string): Promise<{ data: CinemaMovie[] }> {
  return _request(`api_kinoafisha/get_schedule_events?city=${city_id}`, "GET");
}

export function getCities(): Promise<{ data: {} }> {
  return _request(`api_kinoafisha/get_all_cities`, "GET");
}

export function getUsersRating(filmId: string): Promise<{ [id: string]: number }[]> {
  return _request(`get_ratings_for_film?film_id=${filmId}`, "GET");
}

export function getAIAdvice(content: string): Promise<{ content: string }> {
  return _request(`gigachat/create_prompt?content=${content}`, "POST");
}

// export async function getCoordinates(address: string) {
//   const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_KEY}&geocode=${address}&format=json`;
//   return await fetch(url)
//     .then((response) => response.json())
//     .then((res) => res)
//     .catch((error) => console.error(error));
// }

export async function getUserIP() {
  return await fetch("https://ipapi.co/json")
    .then((response) => response.json())
    .then((res) => res)
    .catch((error) => console.error(error));
}

export async function getUserCity(location): Promise<string> {
  return await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
  )
    .then((response) => response.json())
    .then((res) => res.address.city.replace("городской округ", "").trim())
    .catch((error) => console.error(error));
}

async function _request(path: string, method: string, body?: any) {
  const url = HTTP_URL + path;
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
