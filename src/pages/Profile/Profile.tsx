import React, { useContext, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import AdaptiveContainer from "../../components/AdaptiveContainer/AdaptiveContainer";
import MovieCard from "../../components/MovieCard/MovieCard";
import { UserContext } from "../../context/UserProvider";

export default function Profile() {
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(false)
  }, [user])

  function getMovieJSX(type: string): JSX.Element {
    return user[type].length ? user[type].map((movie) => <MovieCard movie={movie} />) : 'Пусто :('
  }

  return (
    loading
      ? <Skeleton />
      : (
        <div>
          <h1 className="mb-6">Добро пожаловать, {user.username}!</h1>
          <div className="grid gap-8">
            <div className="mb-6">
              <h1 className="mb-3">Избранные фильмы</h1>
              <AdaptiveContainer content={getMovieJSX('favorite_films')} />
            </div>
            <div className="mb-6">
              <h1 className="mb-3">Просмотренные фильмы</h1>
              <AdaptiveContainer content={getMovieJSX('finished_films')} />
            </div>
            <div className="mb-6">
              <h1 className="mb-3">Заброшенные фильмы</h1>
              <AdaptiveContainer content={getMovieJSX('abandoned_films')} />
            </div>
            <div className="mb-6">
              <h1 className="mb-3">Отложенные фильмы</h1>
              <AdaptiveContainer content={getMovieJSX('postponed_films')} />
            </div>
            <div className="mb-6">
              <h1 className="mb-3">Запланированные фильмы</h1>
              <AdaptiveContainer content={getMovieJSX('planned_films')} />
            </div>
          </div>
        </div>
      )
  )
}