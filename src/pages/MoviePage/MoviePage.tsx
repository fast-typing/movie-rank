import React, { useEffect, useState } from "react";
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
import { getMovie, getReviews, markFilm } from "../../services/http.service";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { movieFieldsC, toggleButtonsC } from "../../App.constants";
import ReviewBlock from "../../components/ReviewBlock/ReviewBlock";
import AdaptiveContainer from "../../components/AdaptiveContainer/AdaptiveContainer";

export default function MoviePage() {
  const [movie, setMovie] = useState<Movie>(null);
  const [alignment, setAlignment] = useState<string>(null);
  const [reviews, setReviews] = useState(null);
  const [detailedInfo, setDetailedInfo] = useState(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingButtons, setLoadingButtons] = useState<boolean>(false);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);

  const { id } = useParams();
  const movieFields = movieFieldsC;

  useEffect(() => {
    const init = async () => {
      const resMovie = await getMovie(id);
      const resReviews = await getReviews(id);
      if (!resMovie || !resReviews) return;

      const jsxReviews = resReviews.map((review) => (
        <ReviewBlock review={review} />
      ));
      const info = [];
      for (let key of Object.keys(movieFields)) {
        info.push(
          <div className="flex gap-2 justify-between md:justify-normal">
            <span className="w-[150px]">{movieFields[key]}: </span>
            <h3>{resMovie[key]}</h3>
          </div>
        );
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000)
      setMovie(resMovie);
      setReviews(jsxReviews);
      setDetailedInfo(info);
    };

    init();
  }, []);

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "postopened" | "abandoned" | "finished" | "planned"
  ) => {
    setLoadingButtons(true);
    const token = localStorage.getItem('token') ?? '';
    const res = await markFilm(token, movie.id, newAlignment);
    if (typeof res == "string") setAlignment(newAlignment);
    setLoadingButtons(false);
  };

  async function toggleFavorite() {
    setLoadingFavorite(true);
    const token = localStorage.getItem('token') ?? '';
    const res = await markFilm(token, movie.id, "favorite");
    if (typeof res == "string") setFavorite(!favorite);
    setLoadingFavorite(false);
  }

  const toggleButtons = toggleButtonsC.map((item) => {
    return (
      <ToggleButton className="w-full grid md:w-fit md:flex" value={item.value}>
        {item.icon}
        <span className="ml-1 hidden md:block">{item.text}</span>
      </ToggleButton>
    );
  });

  const floatIcon = loadingFavorite ? (
    <RefreshRoundedIcon className="loading" />
  ) : favorite ? (
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
        <div className="grid gap-4 w-full">
          <div className="w-full grid gap-4 items-center md:justify-between xl:flex">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
              <h1>{movie.title}</h1>
              <Rating
                max={10}
                precision={0.5}
                defaultValue={movie.average_rating}
                readOnly
              />
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                color="primary"
                disabled={loadingFavorite}
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
          <div className="grid md:flex gap-4 w-full">
            <img
              src={movie.poster}
              className="rounded object-cover w-full md:w-[30%]"
              alt=""
            />
            <video className="rounded w-full md:w-[70%]" controls>
              <source
                src="https://video-preview.s3.yandex.net/OHRcNgIAAAA.mp4"
                type="video/mp4"
              />
              Your browser doesn't support HTML5 video tag.
            </video>
          </div>
          <Divider />
          <div>
            <h1 className="mb-4">Подробная информация</h1>
            <AdaptiveContainer
              content={detailedInfo}
              additionalStyles="gap-x-16 gap-y-3"
            />
          </div>
          <Divider />
          <div>
            <h1 className="mb-4">Отзывы</h1>
            <div className="grid gap-8">
              {reviews.length ? reviews : "Отзывов нема :("}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
