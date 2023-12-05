import { YMaps, Map, FullscreenControl, Placemark } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import KinoAfisha from "./KinoAfisha/KinoAfisha";
import { getCinemasByCity, getCities, getCoordinates, getUserCity, getUserIP } from "../../services/http.service";
import { Cinema } from "../../interfaces/Interfaces";
import { CircularProgress, Skeleton, TextField } from "@mui/material";
import Ad from "../../components/Ad";
import Autocomplete from "@mui/material/Autocomplete";
import { YANDEX_API_KEY } from "../../App.constants";
import AdaptiveContainer from "../../components/AdaptiveContainer";
import MovieSkeleton from "../../components/MovieSkeleton";

export default function Cinemas() {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cinemas, setCinemas] = useState<Cinema[]>();
  const [userCity, setUserCity] = useState<{ name: string; id: string }>(null);
  const [cities, setCities] = useState<{ name: string; id: string }[]>(null);
  const [addresses, setAddresses] = useState<{ name: string; coordinates: number[] }[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await initCinemas();
      setLoading(false);
    };

    init();
  }, []);

  async function initCinemas() {
    const resCities = await getCities();
    const formattedCities = [];
    let counter = 0;
    for (const [key, value] of Object.entries(resCities.data)) {
      if (counter === 100) break;
      formattedCities.push({ id: value, name: key });
      counter++;
    }
    setCities(formattedCities);

    await navigator.geolocation.getCurrentPosition(
      async (e) => {
        const latt = e.coords.latitude;
        const long = e.coords.longitude;
        const res = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=49926734-3300-4b73-9e9b-b37dc88e4449&geocode=${long},${latt}&format=json`
        );
        const data = await res.json();
        const city = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components[4].name;
        const location = { latitude: latt, longitude: long };
        const localStorageLocation = JSON.parse(localStorage.getItem("location"));
        if (location !== localStorageLocation) {
          localStorage.setItem("location", JSON.stringify({ latitude: location.latitude, longitude: location.longitude }));
        }
        const city_id = resCities.data[city];
        const cinemas = await getCinemas(city_id);
        await initAddresses(cinemas, city);
        setCoordinates({ latitude: latt, longitude: long });
        setUserCity({ name: city, id: city_id });
        setCinemas(cinemas);
      },
      async (e) => {
        const cinemas = await getCinemas("360");
        await initAddresses(cinemas, "Пенза");
        setUserCity({ name: "Пенза", id: "360" });
        setCoordinates({ latitude: 53.2007, longitude: 45.0046 });
        setCinemas(cinemas);
      }
    );
  }

  async function getCinemas(city_id: string) {
    const resCinemas = await getCinemasByCity(city_id);

    const cinemasByKey = [];
    resCinemas.data.map((movie) => {
      const isCinemaExist = cinemasByKey[movie.cinema_name];
      if (isCinemaExist) {
        cinemasByKey[movie.cinema_name].push(movie);
      } else {
        cinemasByKey[movie.cinema_name] = [movie];
      }
    });

    return formatAfishaCinemas(cinemasByKey);
  }

  async function handleCityChange(e: any, newCity: { name: string; id: string }) {
    if (newCity === null) return;
    setLoading(true);

    const city = newCity;
    const city_id = cities.find((el) => el.name === city.name).id;
    const resCinemas = await getCinemasByCity(city_id);
    const cinemasByKey = [];
    resCinemas.data.map((movie) => {
      const isCinemaExist = cinemasByKey[movie.cinema_name];
      if (isCinemaExist) {
        cinemasByKey[movie.cinema_name].push(movie);
      } else {
        cinemasByKey[movie.cinema_name] = [movie];
      }
    });
    const cinemas = formatAfishaCinemas(cinemasByKey);

    const coordinates = await getCoordinates(`город ${city.name}`);
    setCoordinates({ longitude: coordinates[0], latitude: coordinates[1] });
    const cinemasWithCoord = [];
    const getData = async (name) => {
      const correctedName = name.replace("&", "и");
      return await getCoordinates(`Кинотеатр ${correctedName} ${city}`);
    };

    for (let i = 0; i < cinemas.length; i++) {
      const coordinates = await getData(cinemas[i].name);
      cinemasWithCoord.push({ name: cinemas[i].name, coordinates: coordinates.reverse() });
    }

    setAddresses(cinemasWithCoord);
    setUserCity(city);
    setCinemas(cinemas);
    setLoading(false);
  }

  function formatAfishaCinemas(cinemas) {
    const formattedCinemas = [];
    for (const key of Object.keys(cinemas)) {
      const timetable = [];
      cinemas[key].map((movie) => {
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
    return formattedCinemas;
  }

  async function initAddresses(inputCinemas, city: string) {
    const localCinemasCoords = localStorage.getItem("cinemas_coordinates");
    if (localCinemasCoords && city === localStorage.getItem("city")) {
      setAddresses(JSON.parse(localCinemasCoords));
      return;
    } else {
      localStorage.setItem("city", city);
    }

    const cinemasWithCoord = [];
    const getData = async (name) => {
      const correctedName = name.replace('&', 'и')
      const url = `https://search-maps.yandex.ru/v1/?text=Кинотеатр ${correctedName} ${city}&lang=ru_RU&apikey=${YANDEX_API_KEY}`;
      const res = await fetch(url);
      const data = await res.text();
      return data;
    };

    for (let i = 0; i < inputCinemas.length; i++) {
      const data = await getData(inputCinemas[i].name);
      const features = JSON.parse(data)["features"]
      if (!features.length) continue
      const cinemaCoordinates = features[0]["geometry"]["coordinates"];
      cinemasWithCoord.push({ name: inputCinemas[i].name, coordinates: cinemaCoordinates.reverse() });
    }

    localStorage.setItem("cinemas_coordinates", JSON.stringify(cinemasWithCoord));
    setAddresses(cinemasWithCoord);
  }

  return loading ? (
    <>
      <div>
        <div className="grid gap-2 sm:flex justify-between mb-4">
          <Skeleton height={43} width={90} />
          <Skeleton height={43} width={300} />
        </div>
        <div className="grid gap-4">
          <Skeleton className="w-full !min-h-[500px]" />
          <Skeleton height={130} className="w-full" />
        </div>
      </div>
      <div className="grid gap-4">
        <Skeleton height={43} width={180} />
        <Skeleton height={48} className="w-full" />
        <AdaptiveContainer content={<>{[0, 0, 0, 0, 0].map((el, i) => <MovieSkeleton key={i} />)}</>} />
        {/* <KinoAfisha cinemas={cinemas} /> */}
      </div>
    </>
  ) : (
    <>
      <div>
        <div className="grid gap-2 sm:flex justify-between mb-4">
          <h1>Карта</h1>
          <Autocomplete
            disablePortal
            onChange={handleCityChange}
            size="small"
            value={userCity}
            id="combo-box-demo"
            options={cities}
            sx={{ width: 300 }}
            getOptionLabel={(city) => city?.name}
            renderInput={(params) => <TextField {...params} label="Город" />}
          />
        </div>
        <div className="grid gap-4">
          <div className="w-full h-[500px]">
            {coordinates ? (
              <YMaps>
                <Map className="w-full h-full" defaultState={{ center: [coordinates.latitude, coordinates.longitude], zoom: 12 }}>
                  <FullscreenControl />
                  {addresses.map((cinema) => (
                    <Placemark
                      geometry={cinema.coordinates}
                      properties={{ iconCaption: "Кинотеатр " + cinema.name }}
                      options={{ iconColor: "#d32f2f" }}
                    // onClick={}
                    />
                  ))}
                </Map>
              </YMaps>
            ) : null}
          </div>
          <Ad width="100%" height="130px"></Ad>
        </div>
      </div>
      <div>
        <h1 className="mb-4">Кинотеатры</h1>
        <KinoAfisha cinemas={cinemas} />
      </div>
    </>
  );
}
