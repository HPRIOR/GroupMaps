import React, { useState, useEffect } from 'react';
import Location from './ObjectTypes/Location';
import groupLocations from './GroupLocations'
import GoogleMap from './components/GoogleMap';
import './styles/App.css'
import nextId from "react-id-generator";
import PostCodeInput from './components/PostCodeInput';

type locationInGroup = {
    location: Location,
    marker: google.maps.Marker
    colour: string
}

const App = () => {
    const [locations, setLocations]: [Location[], Function] = useState<Location[]>([]);
    const [postCodeInput, setPostCodeInput]: [string, Function] = useState<string>("");
    const [postCodeInputOnButtonPress, setPostCodeInputWithButton]: [string, Function] = useState<string>("");
    const [distance, setGroupDistance]: [number, Function] = useState<number>(1);
    const [locationGroups, setLocationGroups]: [locationInGroup[][], Function] = useState([])

    const removeLocation = (id: string) => {
        setLocationGroups((previousGroups: locationInGroup[][]) => {
            const deletedMarker = previousGroups.flat().find(m => m.location.id === id);
            if (deletedMarker)
                deletedMarker.marker.setMap(null);
            return previousGroups.map(group => group.filter(m => m.location.id !== id));
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
            const newState : Location[] = [
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

    /* 
     This will generate locationGroups, which represent each locations group, and information regarding that group,
     such it's associates icon colour, and marker. This is passed into the sidebar.
     TODO could possibly refactor groups into location 
    */
    useEffect(() => {
        /*
         The check for google === undefined is to make tests play nice with Maps API. Without this condition,
         google will remain undefined during the testing of other features of the app (e.g. querying the
         postcode API)
         */
        if (locations.length === 0 || (window as any).google === undefined) return;

        const locationGroups: locationInGroup[][] = groupLocations(locations, distance).map(group => {
            const colour = "#" + Math.floor(Math.random() * 16777215).toString(16);
            const icon = generateIconWith(colour);
            return group.map(location => {
                const marker = new (window as any).google.maps.Marker({
                    map: (window as any).map,
                    position: new (window as any).google.maps.LatLng(location.lat, location.lng),
                    icon: icon
                });
                return { location: location, marker: marker, colour: colour }
            });
        });
        setLocationGroups((marker: locationInGroup[][]) => {
            // remove previous markers from maps API
            marker.flat().forEach(m => m.marker.setMap(null));
            return locationGroups
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
            {/*<GoogleMap />*/}
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