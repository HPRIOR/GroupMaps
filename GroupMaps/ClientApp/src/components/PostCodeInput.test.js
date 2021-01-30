﻿import PostCodeInput from './PostCodeInput';
import React from 'react';
import {render} from '@testing-library/react'


const test_locations = [
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

