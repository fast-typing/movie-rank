import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import {
  Divider,
  IconButton,
  Rating,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { favoriteToggle, getMovie, getReviews, getUserData, markFilm } from "../../services/http.service";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { movieFieldsC, toggleButtonsC } from "../../App.constants";
import ReviewBlock from "../../components/ReviewBlock/ReviewBlock";
import AdaptiveContainer from "../../components/AdaptiveContainer/AdaptiveContainer";
import { changeBooleanTypesOfMovies } from "../../context/UserProvider";
import { markFavorites } from "../../services/favorite.service";

export default function MoviePage() {
  const [movie, setMovie] = useState<Movie>(null);
  const [alignment, setAlignment] = useState<"postopened" | "abandoned" | "finished" | "planned">(null);
  const [reviews, setReviews] = useState(null);
  const [detailedInfo, setDetailedInfo] = useState(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingButtons, setLoadingButtons] = useState<boolean>(false);
  const [favorite, setFavorite] = useState({ isFavorite: false, loading: false });

  const { id } = useParams();
  const movieFields = movieFieldsC;

  useEffect(() => {
    const init = async () => {
      let resMovies = await getMovie(id);
      const resReviews = await getReviews(id);
      const token = localStorage.getItem('token')
      const user = await getUserData(token)
      if (!resMovies || !resReviews || !user) return;
      resMovies = changeBooleanTypesOfMovies([resMovies], user)[0]
      setFavorite({ ...favorite, isFavorite: resMovies.is_favorite })

      const jsxReviews = resReviews.map((review) => (
        <ReviewBlock review={review} />
      ));
      const info = [];
      for (let key of Object.keys(movieFields)) {
        info.push(
          <div className="flex gap-2 justify-between md:justify-normal text-sm">
            <span className="md:w-[140px]">{movieFields[key]}: </span>
            <h3 className="text-sm text-right md:text-left">
              {Array.isArray(resMovies[key]) ? resMovies[key].map((el) => <span>{el}, </span>) : resMovies[key]}
            </h3>
          </div>
        );
      }

      let alignment = null
      if (resMovies.is_abandoned) alignment = "abandoned"
      if (resMovies.is_planned) alignment = "planned"
      if (resMovies.is_postponed) alignment = "postponed"
      if (resMovies.is_finished) alignment = "finished"
      setAlignment(alignment)

      setMovie(resMovies);
      setReviews(jsxReviews);
      setDetailedInfo(info);
      setLoading(false);
    };

    init();
  }, []);

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "postopened" | "abandoned" | "finished" | "planned"
  ) => {
    setLoadingButtons(true);
    const user_id = localStorage.getItem('user_id') ?? '';
    if (newAlignment === null) {
      const res = await markFilm(user_id, movie.id, alignment);
      if (res.Message) setAlignment(null);
    } else {
      const res = await markFilm(user_id, movie.id, newAlignment);
      if (res.Message) setAlignment(newAlignment);
    }
    setLoadingButtons(false);
  };

  async function toggleFavorite() {
    setFavorite({ ...favorite, loading: true });
    const user_id = localStorage.getItem('user_id') ?? '';
    const res = await favoriteToggle(user_id, movie.id);
    if (res.Message) {
      setFavorite({ loading: false, isFavorite: !favorite.isFavorite });
    } else {
      setFavorite({ ...favorite, loading: false });
    }
  }

  const toggleButtons = toggleButtonsC.map((item) => {
    return (
      <ToggleButton className="w-full grid md:w-fit md:flex" value={item.value}>
        {item.icon}
        <span className="ml-1 hidden md:block">{item.text}</span>
      </ToggleButton>
    );
  });

  const floatIcon = favorite.loading ? (
    <RefreshRoundedIcon className="loading" />
  ) : favorite.isFavorite ? (
    <BookmarkIcon />
  ) : (
    <BookmarkBorderIcon />
  );

  return (
    <div>
      {loading ? (
        <div className="grid gap-4 w-full">
          <div className="w-full grid lg:flex gap-4 items-center md:justify-between">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
              <Skeleton variant="rounded" width={200} height={47} />
              <Skeleton variant="rounded" width={200} height={47} />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton
                className="w-full md:w-[415px]"
                variant="rounded"
                height={47}
              />
            </div>
          </div>
          <div className="grid md:flex gap-4 w-full">
            <Skeleton
              className="w-full md:w-[30%]"
              variant="rounded"
              height={500}
            />
            <Skeleton
              className="w-full md:w-[70%]"
              variant="rounded"
              height={500}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-16 gap-y-4 h-fit w-full">
            {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el) => (
              <Skeleton variant="rounded" width={180} height={30} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 w-full">
          <div className="w-full grid gap-4">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
              <h1>{movie.title}, ({movie.average_rating})</h1>
              <Rating
                max={10}
                precision={0.5}
                defaultValue={movie.average_rating}
                size="large"
                readOnly
              />
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                color="primary"
                disabled={favorite.loading}
                onClick={toggleFavorite}
              >
                {floatIcon}
              </IconButton>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                disabled={loadingButtons}
                className="w-full md:w-fit"
              >
                {toggleButtons}
              </ToggleButtonGroup>
            </div>
          </div>
          <div className="grid md:flex gap-8 w-full">
            <div className="grid gap-4 md:max-w-[30%] min-w-[300px]">
              <img
                src={movie.poster}
                className="rounded object-cover w-full"
                alt={movie.title}
              />
              <video className="rounded w-full" controls>
                <source
                  src={movie.trailer}
                  type="video/mp4"
                />
                Your browser doesn't support HTML5 video tag.
              </video>
            </div>
            <div className="w-full">
              <h2 className="mb-4">О фильме</h2>
              <div className="grid gap-4">
                {detailedInfo}
              </div>
            </div>
          </div>
          {/* <Divider />
          <div>
            <h1 className="mb-4">Подробная информация</h1>
            <div className="grid gap-4">
              {detailedInfo}
            </div>
          </div> */}
          <div>
            <h2 className="mb-4">Отзывы</h2>
            <div className="grid gap-8">
              {reviews.length ? reviews : "Отзывов нема :("}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
