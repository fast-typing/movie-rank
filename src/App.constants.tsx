import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MapRoundedIcon from '@mui/icons-material/MapRounded';

export const movieFieldsC = {
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
  age_rating: "Рейтинг MPAA",
  premiere_russia: "Премьера в России",
  premiere_world: "Премьера в мире",
};

export const openInputStyleC = {
  width: "250px",
  transition: "width .5s, opacity .4s, padding .6s",
  opacity: 1,
  paddingLeft: 12,
  paddingRight: 12,
};

export const closeInputStyleC = {
  width: 0,
  transition: "width .5s, opacity .4s, padding .6s",
  opacity: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

export const sideBarStyleC = {
  width: "50vw",
  maxWidth: "500px",
  minWidth: "350px",
  backgroundColor: "#424242",
  height: "100vh",
  padding: 4,
};

export const toggleButtonsC = [
  { value: "finished", icon: <CheckRoundedIcon />, text: "Просмотрено" },
  { value: "postponed", icon: <AccessTimeRoundedIcon />, text: "Отложено" },
  { value: "abandoned", icon: <DeleteRoundedIcon />, text: "Брошено" },
  { value: "planned", icon: <MapRoundedIcon />, text: "Запланировано" },
];

export const MPAARatingC = [
  { value: "G", name: "0+" },
  { value: "P", name: "6+" },
  { value: "PG13", name: "12+" },
  { value: "R", name: "16+" },
  { value: "NC17", name: "18+" },
];

export const filterInputsC = [
  { value: "title", name: "Название" },
  { value: "year", name: "Год показа" },
  { value: "genres", name: "Жанр" },
  { value: "country", name: "Страна" },
]