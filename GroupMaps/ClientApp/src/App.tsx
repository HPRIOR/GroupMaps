import React, { useState, useEffect } from 'react';
import Location from './ObjectTypes/Location';
import groupLocations from './GroupLocations'
import GoogleMap from './components/GoogleMap';
import './styles/App.css'
import nextId from "react-id-generator";
import PostCodeInput from './components/PostCodeInput';

type MarkerWithId = {
    id: string,
    marker: google.maps.Marker
}

const App = () => {
    const [locations, setLocations]: [Location[], Function] = useState<Location[]>([]);
    const [postCodeInput, setPostCodeInput]: [string, Function] = useState<string>("");
    const [postCodeInputOnButtonPress, setPostCodeInputWithButton]: [string, Function] = useState<string>("");
    const [distance, setGroupDistance]: [number, Function] = useState<number>(1);
    const [markers, setMarkers]: [MarkerWithId[], Function] = useState([])

    const removeLocation = (id: string) => {
        setMarkers((previousMarkers: MarkerWithId[]) => {
            const deletedMarker = previousMarkers.find(m => m.id === id);
            if (deletedMarker)
                deletedMarker.marker.setMap(null);
            return previousMarkers.filter(m => m.id !== id);
        });
        setLocations((previousLocations: Location[]) => previousLocations.filter(l => l.id !== id));
    }

    // fetch post code
    useEffect(() => {
        if (postCodeInputOnButtonPress.length <= 0) return
        const fetchPostCode = async () => {
            const url = "https://api.postcodes.io/postcodes/" + postCodeInputOnButtonPress;
            await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200)
                        changeLocationState(data)
                })
        };
        fetchPostCode();
    }, [postCodeInputOnButtonPress]);

    const changeLocationState = (data: any) => {
        const id = nextId();
        setLocations((previousLocations: Location[]) => {
            const newState = [
                ...previousLocations,
                {
                    id: id,
                    lng: data.result.longitude,
                    lat: data.result.latitude,
                    norm_lng: data.result.longitude + 180,
                    norm_lat: data.result.latitude + 90,
                    postcode: data.result.postcode
                },
            ]
            return newState;
        });
        setPostCodeInput("");
        setPostCodeInputWithButton("");
    }

    // set each group's marker
    useEffect(() => {
        /*
         The check for google === undefined is to make tests play nice with Maps API. Without this condition
         google will remaine undefined during the testing of other features of the app (e.g. querying the
         postcode API)
         */
        if (locations.length === 0 || (window as any).google === undefined) return;

        const groupMarkers: MarkerWithId[] = groupLocations(locations, distance).map(group => {
            let icon = generateIconWith("#" + Math.floor(Math.random() * 16777215).toString(16));
            return group.map(location => {
                    const marker = new (window as any).google.maps.Marker({
                    map: (window as any).map,
                    position: new (window as any).google.maps.LatLng(location.lat, location.lng),
                    icon: icon
                    });
                return { id: location.id, marker: marker }
            });
        }).flat();
        setMarkers((marker: MarkerWithId[]) => {
            marker.forEach(m => m.marker.setMap(null));
            return groupMarkers
        });
    }, [locations, distance]);

    const generateIconWith = (colour: string) => {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: colour,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 1,
        };
    }
    return (
        <div id="main-window">
            <GoogleMap />
            <PostCodeInput
                locations={locations}
                postcode={postCodeInput}
                handleInputChange={e => setPostCodeInput(e.target.value)}
                addButtonCallBack={() => setPostCodeInputWithButton(postCodeInput)}
                removeButtonCallBack={removeLocation}

            />
        </div>
    )
}

export default App;