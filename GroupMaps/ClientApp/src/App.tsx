import React, { useState, useEffect } from 'react';
import Location from './ObjectTypes/Location';
import groupLocations from './GroupLocations'
import GoogleMap from './components/GoogleMap';
import './styles/App.css'
import nextId from "react-id-generator";
import PostCodeInput from './components/PostCodeInput';
import GroupByDistanceSlider from './components/GroupByDistanceSlider';

type LocationGroup = {
    colour: string,
    locationGroup: Location[]
}

const App = () => {
    const [locationGroups, setLocationGroups]: [LocationGroup[], Function] = useState<LocationGroup[]>([]);
    const [postCodeInput, setPostCodeInput]: [string, Function] = useState<string>("");
    const [postCodeInputOnButtonPress, setPostCodeInputWithButton]: [string, Function] = useState<string>("");
    const [distance, setGroupDistance]: [number, Function] = useState<number>(1);

    const removeLocation = (id: string) => {
        setLocationGroups((previousGroups: LocationGroup[]) => {
            previousGroups
                .map(l => l.locationGroup)
                .flat()
                .filter(l => l.id === id)
                .forEach(l => l.marker?.setMap(null));
            return groupLocations(
                previousGroups
                    .map(l => l.locationGroup)
                    .flat()
                    .filter(l => l.id !== id),
                distance)
                    .map(group => (
                        {
                            colour: "#" + Math.floor(Math.random() * 16777215).toString(16),
                            locationGroup: group
                        }
                    ));
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

    const getLocationGroups = (locationGroups: Location[][]): LocationGroup[] => locationGroups.map(group => (
                {
                    colour: "#" + Math.floor(Math.random() * 16777215).toString(16),
                    locationGroup: group
                }
            ));


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

    const onRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocationGroups((previousGroups: LocationGroup[]) => null)
        setGroupDistance(event.target.value)
    }

    return (
        <div id="main-window">
            {/*<GoogleMap />*/}
            <GroupByDistanceSlider
                maxRange={10}
                distance={distance}
                onRangeChange={event => setGroupDistance(event.target.value)}
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