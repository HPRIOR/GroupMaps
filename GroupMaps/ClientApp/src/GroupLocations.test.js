import groupLocations from './GroupLocations'
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
const diagonal_location_groups = [
    {
        id: 1,
        lat: 1,
        lng: 1,
        norm_lat: 91,
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
        lat: 5,
        lng: 5,
        norm_lat: 95,
        norm_lng: 185,
        postcode: "NW4 6RF"
    }

]
const joined_locations = [
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
        id: 2,
        lat: 1,
        lng: 1,
        norm_lat: 91,
        norm_lng: 181,
        postcode: "NW5 2NJ"


    },
    {
        id: 2,
        lat: 2,
        lng: 2,
        norm_lat: 92,
        norm_lng: 182,
        postcode: "NW5 2NJ"
    },
    {
        id: 2,
        lat: 3,
        lng: 3,
        norm_lat: 93,
        norm_lng: 183,
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
const disjoined_locations = [
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
        id: 2,
        lat: 1,
        lng: 1,
        norm_lat: 91,
        norm_lng: 181,
        postcode: "NW5 2NJ"


    },
   {
        id: 2,
        lat: 3,
        lng: 3,
        norm_lat: 93,
        norm_lng: 183,
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

describe('GroupLocations', () => {
    it('Does not throw an error', () => {
        expect(() => groupLocations(test_locations_1, 1)).not.toThrow();
    });

    it('Produces two groups - distance: 1', () => {
        expect(groupLocations(test_locations_1, 1).length).toEqual(2);
    });

    it('Produces one group - distance: max(lat, lng)', () => {
        expect(groupLocations(test_locations_1, 5).length).toEqual(1);
    });

    it('Produces as many groups as locations where distance is half less than any distance between points', () => {
        expect(groupLocations(test_locations_1, 0.5).length).toEqual(4);
    });

    it('Diagonal adjacent groups produce expected result - distance: 1', () => {
        expect(groupLocations(diagonal_location_groups, 1).length).toEqual(2);
    });

    it('Diagonal adjacent groups produce one group - distance: max(lat,lng)', () => {
        expect(groupLocations(diagonal_location_groups, 5).length).toEqual(1);
    });

    it('Diagonal adjacent groups produce as many groups as locations - distance: half less than any distance between points', () => {
        expect(groupLocations(diagonal_location_groups, 0.5).length).toEqual(4);
    });

    it('Joined and disjoined location(s) produce 1 and 2 groups respectively', () => {
        expect(groupLocations(joined_locations, 1).length).toEqual(1);
        expect(groupLocations(disjoined_locations, 1).length).toEqual(2);
    });


});


