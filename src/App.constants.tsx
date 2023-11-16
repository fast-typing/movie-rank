import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';

export const AMOUNT_OF_MOVIES_ON_PAGE = 24
export const AMOUNT_OF_COMMENTS_ON_PAGE = 6
export const AMOUNT_OF_REVIEWS_ON_PAGE = 12
export const AMOUNT_OF_MOVIES_ON_FAST_SEARCH = 3
export const LIMIT_OF_REVIEW_BY_DEFAULT = 3

export const YANDEX_API_KEY = '8f171b20-f9ec-49cb-97f2-a8e9153f25f4'
export const HTTP_URL = "https://backend.movie-rank.ru/"
// export const HTTP_URL = "https://dvigit.onrender.com/"
export const CITY = 'ижевск' 

export const MOVIE_FIELDS = {
  country: "Страна",
  genres: "Жанры",
  year: "Год создания",
  director: "Режиссер",
  writers: "Сценаристы",
  producers: "Продессеры",
  // cinematographers: "Операторы",
  // composers: "Композиторы",
  // art_directors: "Художники",
  // editor: "Монтажеры",
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
  backgroundColor: "#323232",
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
  // { value: "genres", name: "Жанр" },
  // { value: "country", name: "Страна" },
  // { value: "age_rating", name: "Возрастной ретинг" },
]

export const MOVIE_TYPES = [
  { value: "favorite_films", name: "Избранные фильмы" },
  { value: "finished_films", name: "Просмотренные фильмы" },
  { value: "abandoned_films", name: "Заброшенные фильмы" },
  { value: "postponed_films", name: "Отложенные фильмы" },
  { value: "planned_films", name: "Запланированные фильмы" },
]

export const REVIEW_RATING_OPTIONS = [
  { value: "positive", text: "Очень круто!", icon: <SentimentSatisfiedAltRoundedIcon /> },
  { value: "neutral", text: "Средне", icon: <SentimentNeutralRoundedIcon /> },
  { value: "negative", text: "Ужасно...", icon: <SentimentVeryDissatisfiedRoundedIcon /> },
]

export const PAGE_TITLE_TO_PATH = {
  '/': 'Главная',
  '/cinema': 'Кинотетры',
  '/search': 'Поиск',
  '/profile': 'Профиль',
}