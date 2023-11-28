export interface Movie {
  title: string;
  poster: string;
  trailer: string;
  country: string;
  genres: string[];
  year: number;
  director: string;
  writers: string[];
  producers: string[];
  cinematographers: string[];
  composers: string[];
  art_directors: string[];
  editor: string[];
  budget: string;
  box_office_world: string;
  age_rating: string;
  average_rating: number;
  local_rating: number;
  premiere_russia?: string;
  premiere_world: string;
  is_planned: boolean;
  is_abandoned: boolean;
  is_favorite: boolean;
  is_postponed: boolean;
  is_finished: boolean;
  description: string
  trailer_poster: string
  id: number;
}

export interface Review {
  id: number;
  username: string;
  user_id: string;
  film_id: number;
  rating: number;
  message: string;
  title: string;
  created_at: string;
  attitude: "positive" | "neutral" | "negative";
  disliked_by_users: string[];
  dislikes: number;
  liked_by_users: string[]
  likes: number
}

export interface User {
  id: string;
  username: string;
  planned_films: [];
  abandoned_films: [];
  favorite_films: [];
  postponed_films: [];
  finished_films: [];
  // current_films: [];
}

export interface Registration {
  id: string;
}

export interface Comment {
  user_id: string
  created_at: string
  film_id: number
  message: string
  parent_comment_id: number | null
  parent_review_id: number | null
  username: string
  id: number,
  replies?: Comment[]
}

export interface Cinema {
  name: string;
  timetable: {
    date: string;
    movies: CinemaMovie[];
  }[];
}

export interface CinemaMovie {
  movie_link: string
  cinema_name: string;
  date: Date;
  costmax: string;
  costmin: string;
  time: string;
  times: {
    time: string;
    order_link: string | undefined;
  }[];
  movie_name: string;
  movie_poster: string;
  order_link: string | undefined;
}

export interface RateFilm {
  user_id: string;
  rating: number;
  film_id: number;
}