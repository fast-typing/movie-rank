import { YMaps, Map, SearchControl, FullscreenControl } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import { getCoordinates, getUserIP } from "../../services/http.service";

export default function Cinema() {
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            let IP = JSON.parse(localStorage.getItem('ip'))
            if (!IP) { IP = await getUserIP() }
            // const yandexRes = await getCoordinates('Ижевск, кинотеатр Дядя Фёдор')
            // if (!yandexRes?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point?.pos) return
            // const coordinatesRes = yandexRes.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos(' ')
            // console.log(yandexRes, coordinatesRes)
            setCoordinates({ latitude: IP.latitude, longitude: IP.longitude })
            // setCoordinates({ latitude: coordinatesRes[1], longitude: coordinatesRes[0] })
            setLoading(false) 
        }

        init()
    }, [])

    useEffect(() => {
        console.log(loading)
    }, [loading])

    return (
        loading ? null :
            <YMaps>
                <Map className="w-full" defaultState={{ center: [coordinates.latitude, coordinates.longitude], zoom: 14.5 }} >
                    <FullscreenControl />
                </Map>
            </YMaps>
    )
}