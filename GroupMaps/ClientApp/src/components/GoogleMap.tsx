import '../styles/GoogleMap.css';
import React, { useEffect } from 'react';
import { Loader } from "@googlemaps/js-api-loader";
import getMapsApiKey from './GetApiKey';


type Center = {
    lat: number,
    lng: number
}

type Props = {
    zoom?: number,
    center: Center

}

const GoogleMap = () => {
    useEffect(() => {
        const loader = new Loader({
            apiKey: getMapsApiKey(),
            version: "weekly"
        });
        loader.load().then(() => {
            (window as any).map = new (window as any).google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: {lat: 50.736129, lng: -1.98822}
            })
        });
    }, []);

    return (
        <div id="map"></div>
        )
}

export default GoogleMap;