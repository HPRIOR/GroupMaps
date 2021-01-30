import React, { useState, useEffect } from 'react';
import Location from './ObjectTypes/Location';
import groupLocations from './GroupLocations'
import GoogleMap from './components/GoogleMap';
import './styles/App.css'
import nextId from "react-id-generator";
import PostCodeInput from './components/PostCodeInput';

const App = () => {
    const [locations, setLocations]: [Location[], Function] = useState<Location[]>([]);
    const [postCodeInput, setPostCodeInput]: [string, Function] = useState<string>("");
    const [postCodeInputOnButtonPress, setPostCodeInputWithButton]: [string, Function] = useState<string>("");
    const [distance, setGroupDistance]: [number, Function] = useState<number>(1);
    const [markers, setMarkers] = useState([])


    const removeLocation = id => {
        setMarkers(previousMarkers => {
            const deletedMarker = previousMarkers.find(m => m.id === id);
            deletedMarker.marker.setMap(null);
            return previousMarkers.filter(m => m.id !== id);    
        });
        setLocations(previousLocations => previousLocations.filter(l => l.id !== id));
    }

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

    });

    const changeLocationState = data => {
        const id = nextId();
        setLocations((previousLocations) => {
            const newState: Location[] = [
                ...previousLocations,
                {
                    postcode: data.result.postcode,
                    lng: data.result.longitude,
                    lat: data.result.latitude,
                    norm_lng: data.result.longitude + 180,
                    norm_lat: data.result.latitude + 90,
                    id: id,
                },
            ]
            return newState;
        });
        setPostCodeInput("");
        setPostCodeInputWithButton("");
    }

    useEffect(() => {
        if (locations.length === 0) return;
        const groups = groupLocations(locations, distance)
        let group_markers = []
        for (let group of groups) {
            const groupColour = Math.floor(Math.random() * 16777215).toString(16);
            const w = (window as any)
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
        setMarkers(marker => {
            marker.forEach(m => m.marker.setMap(null));
            return group_markers
        });
    }, [locations, distance]);

    const generateIconWith = colour => {
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
            <GoogleMap center={{ lat: 50.736129, lng: -1.98822 }} />
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
