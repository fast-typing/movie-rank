import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Badge, Button, Skeleton } from "@mui/material";
import AdaptiveContainer from "../../components/AdaptiveContainer";
import MovieCard from "../../components/MovieCard/MovieCard";
import { getRecommendations, getUserData } from "../../services/http.service";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MOVIE_TYPES } from "../../App.constants";
import { useParams } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import Ad from "../../components/Ad";

export default function Profile() {
  const [user, setUser] = useState({ data: null, loading: true });
  const [recommends, setRecommends] = useState<Movie[]>(null);
  const [isLoadedMore, setIsLoadedMore] = useState(false)
  const { username } = useParams();

  useEffect(() => {
    const init = async () => {
      if (username) {
        const resUser = await getUserData(null, username);
        document.title = `Профиль ${resUser.username}`;
        setUser({ data: resUser, loading: false });
      } else {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        if (!token || !user_id) return;
        const resUser = await getUserData(token);
        const resRecommends = await getRecommendations(user_id, 10);
        setUser({ data: resUser, loading: false });
        if (Array.isArray(resRecommends)) {
          setRecommends(resRecommends);
        }
      }
    };

    init();
  }, []);

  function getMovieJSX(type: string): JSX.Element {
    return user.data[type]?.length
      ? user.data[type]?.map((movie) => <MovieCard movie={movie} key={movie.id} hideFavorite={true} />)
      : "Пусто :(";
  }

  function getAmountOfMovieByType(type: string): number {
    return user.data[type]?.length ? user.data[type]?.length : null;
  }

  async function loadMore() {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;
    const resRecommends = await getRecommendations(user_id, 20);
    setRecommends(resRecommends)
    setIsLoadedMore(true)
  }

  return user.loading ? (
    <div>
      <Skeleton variant="rounded" className="w-full mb-6" height={43} />
      <Skeleton variant="rounded" className="w-full" height={280} />
    </div>
  ) : (
    <>
      <div>
        <h1 className="mb-6">{user.data.username}</h1>
        {recommends?.length ? (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
              <div className="flex gap-2 items-center">
                <h3>Рекомендации</h3>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <AdaptiveContainer
                content={recommends.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              />
              {
                isLoadedMore
                  ? null
                  : <Button variant="text" style={{ marginTop: '16px' }} onClick={loadMore}>
                    Показать еще...
                  </Button>
              }
            </AccordionDetails>
          </Accordion>
        ) : null}
        {MOVIE_TYPES.map((type) => {
          return (
            <Accordion key={type.value}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
                <div className="flex gap-2 items-center">
                  <h3>{type.name}</h3>
                  <span
                    className={
                      getAmountOfMovieByType(type.value)
                        ? "bg-[var(--mainColor)] rounded-full w-8 h-8 flex items-center justify-center"
                        : null
                    }
                  >
                    {getAmountOfMovieByType(type.value)}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <AdaptiveContainer content={getMovieJSX(type.value)} />
              </AccordionDetails>
            </Accordion>
          );
        })}
        <br />
        <Ad width='100%' height='130px'></Ad>
      </div>
    </>
  );
}
