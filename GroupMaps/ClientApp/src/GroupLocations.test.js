import  groupLocations  from './GroupLocations'
//const sum = (a, b) => a + b;

//it('sums numbers', () => {
//    expect(sum(1, 2)).toEqual(3);
//    expect(sum(2, 2)).toEqual(4);
//});

const test_locations_two_groups_at_distance_1 = [
    {
        id: 1,
        lat: 0,
        lng: 1,
        norm_lng: 181,
        norm_lat: 90,
        postcode: "N7 9RA"
    },
    {
        id: 2,
        lat: 0,
        lng: 0,
        norm_lng: 180,
        norm_lat: 91,
        postcode: "NW5 2NJ"
    },
    {
        id: 3,
        lat: 4,
        lng: 4,
        norm_lng: 184,
        norm_lat: 94,
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
    expect(() => groupLocations(test_locations_two_groups_at_distance_1, 1)).not.toThrow();
});


it('Test location produces two groups at distance of 1', () => {
    expect(groupLocations(test_locations_two_groups_at_distance_1, 1).length).toEqual(2);
})

