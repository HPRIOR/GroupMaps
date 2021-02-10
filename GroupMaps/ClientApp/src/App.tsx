﻿import React, { useEffect, useState } from 'react';
import nextId from "react-id-generator";
import GoogleMap from './components/GoogleMap';
import GroupByDistanceSlider from './components/GroupByDistanceSlider';
import PostCodeInput from './components/PostCodeInput';
import groupLocations from './GroupLocations';
import Location from './ObjectTypes/Location';
import './styles/App.css';

type LocationGroup = {
    colour: string,
    locationGroup: Location[]
}

const App = () => {
    const [locationGroups, setLocationGroups]: [LocationGroup[], Function] = useState<LocationGroup[]>([]);
    const [postCodeInput, setPostCodeInput]: [string, Function] = useState<string>("");
    const [postCodeInputOnButtonPress, setPostCodeInputWithButton]: [string, Function] = useState<string>("");
    const [distance, setGroupDistance]: [number, Function] = useState<number>(0.000001);

    const colours: string[] = [
        '#03a8a0',
        '#66d313',
        '#039c4b',
        '#fedf17',
        '#21409a',
        '#ff0984',
        '#04adff',
        '#f16623',
        '#e48873',
        '#f44546'
        ];

    const removeLocation = (id: string) => {
        setLocationGroups((previousGroups: LocationGroup[]) => {
            previousGroups
                .map(l => l.locationGroup)
                .flat()
                .filter(l => l.id === id)
                .forEach(l => l.marker?.setMap(null));
            return getLocationGroups(groupLocations(previousGroups
                    .map(l => l.locationGroup)
                    .flat()
                    .filter(l => l.id !== id),
                distance));
        });
    }

    // fetch post code
    useEffect(() => {
        if (postCodeInputOnButtonPress.length <= 0) return;
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
        setLocationGroups((previousLocationGroups: LocationGroup[]) => {
            const flattenedLocations: Location[] = [
                ...previousLocationGroups.map(group => group.locationGroup).flat(),
                {
                    id: id,
                    lng: data.result.longitude,
                    lat: data.result.latitude,
                    norm_lng: data.result.longitude + 180,
                    norm_lat: data.result.latitude + 90,
                    postcode: data.result.postcode,
                    marker: null
                }
            ];
            return getLocationGroups(groupLocations(flattenedLocations, distance));
        });
        setPostCodeInput("");
        setPostCodeInputWithButton("");
    }

    const onRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setGroupDistance(value)
        setLocationGroups((previousGroups: LocationGroup[]) =>
            getLocationGroups(groupLocations(previousGroups.map(group => group.locationGroup).flat(), value)));
    }

    const getLocationGroups = (locationGroups: Location[][]): LocationGroup[] => {
        console.log(locationGroups)
        console.log(distance)
        return locationGroups.map((group, i) => (
            {
                colour: colours[i % 10],
                locationGroup: group
            }
        ))
    };


     useEffect(() => {
        /*
         The check for google === undefined is to make tests play nice with Maps API. Without this condition,
         google will remain undefined during the testing of other features of the app (e.g. querying the
         postcode API)
         */
        if (locationGroups.length === 0 || (window as any).google === undefined) return;
        locationGroups.forEach(lG => {
            lG.locationGroup.forEach(l => {
                l.marker?.setMap(null)
                l.marker = new (window as any).google.maps.Marker({
                    map: (window as any).map,
                    position: new (window as any).google.maps.LatLng(l.lat, l.lng),
                    icon: generateIconWith(lG.colour)
                });
            });
        });
     }, [locationGroups, distance]);

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
            <GroupByDistanceSlider
                maxRange={10}
                distance={distance}
                onRangeChange={onRangeChange}
            />
            <PostCodeInput
                locations={locationGroups.map(l => l.locationGroup).flat()}
                postcode={postCodeInput}
                handleInputChange={e => setPostCodeInput(e.target.value)}
                addButtonCallBack={() => setPostCodeInputWithButton(postCodeInput)}
                removeButtonCallBack={removeLocation}

            />
        </div>
    )
}

export default App;