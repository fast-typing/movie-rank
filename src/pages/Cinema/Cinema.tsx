import { YMaps, Map, FullscreenControl } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import KinoAfisha from "./KinoAfisha/KinoAfisha";

export default function Cinema() {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        const location = position.coords
        setCoordinates({ latitude: location.latitude, longitude: location.longitude });
        localStorage.setItem("location", JSON.stringify({ latitude: location.latitude, longitude: location.longitude }))
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`)
          .then(res => res.json())
          .then(res => {
            const city = res.address.city.replace('городской округ', '').trim()
            console.log(city)
          })
      });
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