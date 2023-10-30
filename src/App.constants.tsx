import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MapRoundedIcon from '@mui/icons-material/MapRounded';

export const MOVIE_FIELDS = {
  country: "Страна",
  genres: "Жанры",
  year: "Год создания",
  director: "Режиссер",
  writers: "Сценаристы",
  producers: "Продессеры",
  cinematographers: "Операторы",
  composers: "Композиторы",
  art_directors: "Художники",
  editor: "Монтажеры",
  budget: "Бюджет",
  box_office_world: "Сборы",
  age_rating: "Рейтинг в России",
  premiere_russia: "Премьера в России",
  premiere_world: "Премьера в мире",
};

export const OPENED_INPUT_STYLE = {
  width: "250px",
  transition: "width .5s, opacity .4s, padding .6s",
  opacity: 1,
  paddingLeft: 12,
  paddingRight: 12,
};

export const CLOSED_INPUT_STYLE = {
  width: 0,
  transition: "width .5s, opacity .4s, padding .6s",
  opacity: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

export const SIDE_BAR_STYLE = {
  width: "100%",
  height: "100%",
  backgroundColor: "#424242",
  padding: 4,
};

export const TOGGLE_BUTTONS = [
  { value: "finished", icon: <CheckRoundedIcon />, text: "Просмотрено" },
  { value: "postponed", icon: <AccessTimeRoundedIcon />, text: "Отложено" },
  { value: "abandoned", icon: <DeleteRoundedIcon />, text: "Брошено" },
  { value: "planned", icon: <MapRoundedIcon />, text: "Запланировано" },
];

export const FILTER_INPUTS = [
  { value: "title", name: "Название" },
  { value: "year", name: "Год показа" },
  { value: "genres", name: "Жанр" },
  { value: "country", name: "Страна" },
  { value: "age_rating", name: "Возрастной ретинг" },
]

export const MOVIE_TYPES = [
  { value: "favorite_films", name: "Избранные фильмы" },
  { value: "finished_films", name: "Просмотренные фильмы" },
  { value: "abandoned_films", name: "Заброшенные фильмы" },
  { value: "postponed_films", name: "Отложенные фильмы" },
  { value: "planned_films", name: "Запланированные фильмы" },
]