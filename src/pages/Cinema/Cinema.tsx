import { YMaps, Map, FullscreenControl } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import { getUserIP } from "../../services/http.service";
import KinoAfisha from "./KinoAfisha/KinoAfisha";

export default function Cinema() {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      let IP = JSON.parse(localStorage.getItem("ip"));
      if (!IP) {
        IP = await getUserIP();
      }
      // const yandexRes = await getCoordinates('Ижевск, кинотеатр Дядя Фёдор')
      // if (!yandexRes?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point?.pos) return
      // const coordinatesRes = yandexRes.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos(' ')
      // console.log(yandexRes, coordinatesRes)
      // setCoordinates({ latitude: coordinatesRes[1], longitude: coordinatesRes[0] })
      setCoordinates({ latitude: IP.latitude, longitude: IP.longitude });
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
        <KinoAfisha />
      </div>
    </>
  );
}

// !!! У API киноафишы баг все сеансы (order_link) "5 ночей с мишкой фреди" перенсятся на "Черепашки-ниндзя: Погром мутантов". Хотя 2 фильм даже не идет в кино 