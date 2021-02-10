type Location = {
    id: string,
    lat: number,
    lng: number,
    norm_lng: number,
    norm_lat: number,
    postcode: string,
    marker: google.maps.Marker | null
}

export default Location;