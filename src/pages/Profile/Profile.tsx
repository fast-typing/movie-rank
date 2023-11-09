import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Badge, Skeleton } from "@mui/material";
import AdaptiveContainer from "../../components/AdaptiveContainer";
import MovieCard from "../../components/MovieCard/MovieCard";
import { getRecommendations, getUserData } from "../../services/http.service";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MOVIE_TYPES } from "../../App.constants";
import { useParams } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";

export default function Profile() {
  const [user, setUser] = useState({ data: null, loading: true })
  const [recommends, setRecommends] = useState<Movie[]>()
  const { username } = useParams()

  useEffect(() => {
    const init = async () => {
      if (username) {
        const resUser = await getUserData(null, username)
        setUser({ data: resUser, loading: false })
      } else {
        const token = localStorage.getItem('token')
        const user_id = localStorage.getItem('user_id')
        if (!token || !user_id) return
        const resUser = await getUserData(token)
        const resRecommends = await getRecommendations(user_id)
        setUser({ data: resUser, loading: false })
        setRecommends(resRecommends)
      }
    }

    init()
  }, [])

  function getMovieJSX(type: string): JSX.Element {
    return user.data[type]?.length ? user.data[type]?.map((movie) => <MovieCard movie={movie} hideFavorite={true} />) : 'Пусто :('
  }

  function getAmountOfMovieByType(type: string): number {
    return user.data[type]?.length ? user.data[type]?.length : null
  }

  return (
    user.loading
      ? <Skeleton />
      : (
        <div>
          <h1 className="mb-6">{user.data.username}</h1>
          {/* <AdaptiveContainer content={recommends.map(el => <MovieCard movie={el}/>)} /> */}
          {MOVIE_TYPES.map((type) => {
            return <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div className="flex gap-2 items-center">
                  <h3>{type.name}</h3>
                  <span className={(getAmountOfMovieByType(type.value) ? "bg-[var(--mainColor)] rounded-full w-8 h-8 flex items-center justify-center" : null)}>{getAmountOfMovieByType(type.value)}</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <AdaptiveContainer content={getMovieJSX(type.value)} />
              </AccordionDetails>
            </Accordion>
          })}
        </div>
      )
  )
}