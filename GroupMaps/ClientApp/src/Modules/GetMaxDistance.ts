

const GetDistanceFromLatLngInKm =
    (latOne: number, lngOne: number, latTwo: number, lngTwo: number) => {
        const R = 6371;
        const degreeLat = degreeToRad(latTwo - latOne);
        const degreeLng = degreeToRad(lngTwo - lngOne);
        const a =
            Math.sin(degreeLat / 2) * Math.sin(degreeLat / 2) +
            Math.cos(degreeToRad(latOne)) * Math.cos(degreeToRad(latTwo)) *
            Math.sin(degreeLng / 2) * Math.sin(degreeLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;


}

const degreeToRad = (degree: number) => degree * (Math.PI / 180);

export default GetDistanceFromLatLngInKm;