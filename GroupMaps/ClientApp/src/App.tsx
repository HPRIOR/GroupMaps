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
        if (locations.length === 0 || (window as any).google === undefined) return;
        const groups = groupLocations(locations, distance)
        const w = (window as any)
        let group_markers: MarkerWithId[] = []
        for (let group of groups) {
            const groupColour = Math.floor(Math.random() * 16777215).toString(16);
            let icon = generateIconWith("#" + groupColour)
            for (let location of group) {
                const marker = new w.google.maps.Marker({
                    map: w.map,
                    position: new w.google.maps.LatLng(location.lat, location.lng),
                    icon: icon
                })
                group_markers.push({ id: location.id, marker: marker });
            }
        }
        setMarkers((marker: MarkerWithId[]) => {
            marker.forEach(m => m.marker.setMap(null));
            return group_markers
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
            <GoogleMap  />
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
