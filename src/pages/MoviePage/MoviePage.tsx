import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import { getAllComments, getMovie, getUsersRating, getUserData, getReviews, getReplies } from "../../services/http.service";
import { LIMIT_OF_REVIEW_BY_DEFAULT, MOVIE_FIELDS } from "../../App.constants";
import Reviews from "./Reviews/Reviews";
import PageSkeleton from "./PageSkeleton/PageSkeleton";
import Trailer from "./Trailer/Trailer";
import { changeBooleanTypesOfMovies } from "../../services/movieField.service";
import { Chip, Divider } from "@mui/material";
import Widgets from "./Widgets/Widgets";
import Comments from "./Comments/Comments";
import { AuthContext } from "../../context/AuthProvider";
import Toast from "../../components/Toast";

export default function MoviePage() {
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [movie, setMovie] = useState<Movie>(null);
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [comments, setComments] = useState(null);
  const [usersRatings, setUsersRatings] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { filmId } = useParams();
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)

    const init = async () => {
      setLoading(true);
      const resMovie = await getMovie(filmId);
      const resReviews = await getReviews(filmId, LIMIT_OF_REVIEW_BY_DEFAULT);
      const resComments = await getAllComments(filmId);
      const resRatings = await getUsersRating(filmId);
      const token = localStorage.getItem("token");
      const user = token ? await getUserData(token) : null;
      if (!resMovie) return;
      const correctedMovie = changeBooleanTypesOfMovies([resMovie], user)[0];
      // for (let i = 0; i < resComments.length; i++) {
      //   const replies = await getReplies(null, resComments[i].id);
      //   if (!replies.length) continue;
      //   resComments[i] = { ...resComments[i], replies: replies };
      // }

      document.title = correctedMovie.title
      initDetailedInfo(correctedMovie);
      setMovie(correctedMovie);
      setReviews(resReviews);
      setComments(resComments);
      setUsersRatings(resRatings);
      setLoading(false);
    };

    init();
  }, [filmId]);

  function initDetailedInfo(movie: Movie) {
    const info = [];
    const movieFields = MOVIE_FIELDS;
    for (let key of Object.keys(movieFields)) {
      const layout = (
        <div className="flex gap-2 justify-between md:justify-normal text-sm">
          <span className="md:w-[200px]">{movieFields[key]}: </span>
          <h3 className="text-sm text-right md:text-left">
            {Array.isArray(movie[key]) ? movie[key].join(", ") ?? "-" : movie[key] ?? "-"}
          </h3>
        </div>
      );

      info.push(layout);
    }

    setDetailedInfo(info);
  }

  function checkIsAuth(): boolean {
    setOpenSnackBar(false)
    if (isAuth) return true
    setOpenSnackBar(true)
    return false
  }

  return loading ? (
    <PageSkeleton />
  ) : (
    <>
      <div className="grid gap-4 w-full">
        <Widgets movie={movie} usersRatings={usersRatings} checkIsAuth={checkIsAuth} />
        <div className="grid gap-4 w-full">
          <div className="grid h-fit gap-4 w-full md:flex md:h-[500px]">
            <img src={movie.poster} className="rounded object-cover w-full md:w-[40%]" alt={movie.title} />
            <Trailer movie={movie} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map((genre) => (
              <Chip key={genre} label={genre} onClick={() => navigate(`/search?genres=${genre}`)} variant="outlined" />
            ))}
          </div>
          <div className="w-full">
            <Divider className="!mt-0" />
            <p>{movie.description}</p>
            <Divider />
            <div className="grid gap-4">{detailedInfo}</div>
          </div>
        </div>
        <hr />
        <Reviews film_id={filmId} propReviews={reviews} checkIsAuth={checkIsAuth} />
        <hr />
        <Comments film_id={filmId} comments={comments} checkIsAuth={checkIsAuth} />
      </div>
      <Toast open={openSnackBar} onClose={() => setOpenSnackBar(false)} message={"Войдите в аккаунт для данного действия"} />
    </>
  );
}
