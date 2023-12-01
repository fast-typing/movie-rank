import { useEffect, useState } from "react";
import MovieCard from "../../../components/MovieCard/MovieCard";
import { Movie } from "../../../interfaces/Interfaces";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Skeleton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdaptiveContainer from "../../../components/AdaptiveContainer";
import { MOVIE_TYPES } from "../../../App.constants";
import { getRecommendations } from "../../../services/http.service";
import { changeBooleanTypesOfMovies } from "../../../services/movieField.service";

export default function UserMovies({ user }) {
  const [recommends, setRecommends] = useState<{ data: Movie[]; loading: boolean }>({ data: [], loading: true });

  useEffect(() => {
    const init = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;
      const resRecommends = await getRecommendations(user_id, 10);
      if (Array.isArray(resRecommends)) {
        const correctedRecommends = changeBooleanTypesOfMovies(resRecommends, user.data);
        setRecommends({ data: correctedRecommends, loading: false });
      }
    };

    init();
  }, []);

  function getMovieJSX(type: string): JSX.Element {
    return user.data[type]?.length ? user.data[type]?.map((movie) => <MovieCard movie={movie} key={movie.id} hideFavorite={true} />) : "Пусто~";
  }

  function getAmountOfMovieByType(type: string): number {
    return user.data[type]?.length ? user.data[type]?.length : null;
  }

  return recommends.loading ? (
    <Skeleton variant="rounded" className="w-full" height={280} />
  ) : (
    <>
      {recommends.data?.length ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
            <div className="flex gap-2 items-center">
              <h3>Рекомендации</h3>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <AdaptiveContainer
              content={recommends.data.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            />
          </AccordionDetails>
        </Accordion>
      ) : null}
      {MOVIE_TYPES.map((type) => (
        <Accordion key={type.value}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
            <div className="flex gap-2 items-center">
              <h3>{type.name}</h3>
              <span
                className={getAmountOfMovieByType(type.value) ? "bg-[var(--mainColor)] rounded-full w-8 h-8 flex items-center justify-center" : null}
              >
                {getAmountOfMovieByType(type.value)}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <AdaptiveContainer content={getMovieJSX(type.value)} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
