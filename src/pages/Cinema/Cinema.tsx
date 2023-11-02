import { YMaps, Map, SearchControl, FullscreenControl } from "@pbe/react-yandex-maps";
import { useEffect } from "react";
import { getCoordinates } from "../../services/http.service";

export default function Cinema() {
    const { latitude, longitude } = JSON.parse(localStorage.getItem('ip'))

    useEffect(() => {
        const a = getCoordinates('Ижевск ИПЭК')
        console.log(a)
    }, [])

    return (
        <YMaps>
            <Map className="w-full" defaultState={{ center: [latitude, longitude], zoom: 14.5 }} >
                <FullscreenControl />
            </Map>
        </YMaps>
    )
}