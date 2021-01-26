﻿import groupLocations from './GroupLocations'
//const sum = (a, b) => a + b;

//it('sums numbers', () => {
//    expect(sum(1, 2)).toEqual(3);
//    expect(sum(2, 2)).toEqual(4);
//});

const test_locations_1 = [
    {
        id: 1,
        lat: 0,
        lng: 1,
        norm_lat: 90,
        norm_lng: 181,
        postcode: "N7 9RA"
    },
    {
        id: 2,
        lat: 0,
        lng: 0,
        norm_lat: 90,
        norm_lng: 180,
        postcode: "NW5 2NJ"
    },
    {
        id: 3,
        lat: 4,
        lng: 4,
        norm_lat: 94,
        norm_lng: 184,
        postcode: "N7 2G6"
    },
    {
        id: 4,
        lat: 4,
        lng: 5,
        norm_lat: 94,
        norm_lng: 185,
        postcode: "NW4 6RF"
    }
]

it('Does not throw an error', () => {
    expect(() => groupLocations(test_locations_1, 1)).not.toThrow();
});

it('Produces two groups at distance of 1', () => {
    expect(groupLocations(test_locations_1, 1).length).toEqual(2);
})

it('Produces 1 group at a distance equal to max(lat, lng)', () => {
    expect(groupLocations(test_locations_1, 5).length).toEqual(1);
})

it('Produces as many groups as locations where distance is half less than any distance between points', () => {
    expect(groupLocations(test_locations_1, 0.5).length).toEqual(4);
})