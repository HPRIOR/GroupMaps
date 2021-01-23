import '../styles/GoogleMap.css'
import React, { useEffect } from 'react';
import { Loader } from "@googlemaps/js-api-loader"


type Center = {
    lat: number,
    lng: number
}

type Props = {
    apiKey: string,
    zoom?: number,
    center: Center

}

const GoogleMap = (props: Props) => {
    useEffect(() => {
        const loader = new Loader({
            apiKey: props.apiKey,
            version: "weekly"
        });
        loader.load().then(() => {
            (window as any).map = new (window as any).google.maps.Map(document.getElementById('map'), {
                zoom: props.zoom === undefined ? 7 : props.zoom,
                center: props.center
            })
        });
    }, [props]);

    return (
        <div id="map"></div>
        )
}

export default GoogleMap;