import { YMaps, Map, FullscreenControl } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import KinoAfisha from "./KinoAfisha/KinoAfisha";
import { getCinemasByCity, getCities, getUserCity, getUserIP } from "../../services/http.service";
import { Cinema } from "../../interfaces/Interfaces";

export default function Cinemas() {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const [cinemas, setCinemas] = useState<Cinema[]>()

  useEffect(() => {
    const init = async () => {
      const location = await getUserIP()
      setCoordinates({ latitude: location.latitude, longitude: location.longitude });
      localStorage.setItem("location", JSON.stringify({ latitude: location.latitude, longitude: location.longitude }))

      const resCities = await getCities();
      const city = await getUserCity(location)
      const city_id = resCities.data[city]
      const resCinemas = await getCinemasByCity(city_id ?? '354');

      const cinemasByKey = [];
      resCinemas.data.map((movie) => {
        const isCinemaExist = cinemasByKey[movie.cinema_name];
        if (isCinemaExist) {
          cinemasByKey[movie.cinema_name].push(movie);
        } else {
          cinemasByKey[movie.cinema_name] = [movie];
        }
      });
      const formattedCinemas = [];
      for (const key of Object.keys(cinemasByKey)) {
        const timetable = [];
        cinemasByKey[key].map((movie) => {
          if (timetable.find((item) => item.date === movie.date)) {
            const index = timetable.findIndex((el) => el.date === movie.date);
            const index2 = timetable[index].movies.findIndex((el) => el.movie_name === movie.movie_name);
            if (index2 !== -1) {
              timetable[index].movies[index2].times.push({ time: movie.time, order_link: movie.order_link });
            } else {
              timetable[index].movies.push({ ...movie, times: [{ time: movie.time, order_link: movie.order_link }] });
            }
          } else {
            const newMovie = { ...movie, times: [{ time: movie.time, order_link: movie.order_link }] };
            const movieOnNewDate = { date: movie.date, movies: [newMovie] };
            timetable.push(movieOnNewDate);
          }
        });
        formattedCinemas.push({ name: key, timetable: timetable });
      }
      setCinemas(formattedCinemas);
      setLoading(false);
    };

    init();
  }, []);

  return loading ? null : (
    <>
      <YMaps>
        <Map
          className="w-full h-[500px]"
          defaultState={{ center: [coordinates.latitude, coordinates.longitude], zoom: 14.5 }}
        >
          <FullscreenControl />
        </Map>
      </YMaps>
      <div>
        <h1 className="mb-4">Кинотеатры</h1>
        <KinoAfisha cinemas={cinemas} />
      </div>
    </>
  );
}