import PostCodeInput from './PostCodeInput';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event"

const test_locations = () => [
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

const postCodeInputProp = {
    locations: test_locations,
    postcode: "test",
    handleInputChange: () => { },
    addButtonCallBack: () => { },
    removeButtonCallBack: () => { }
}

const Component = <PostCodeInput
    locations={postCodeInputProp.locations()}
    postcode={postCodeInputProp.postcode}
    handleInputChange={postCodeInputProp.handleInputChange}
    addButtonCallBack={postCodeInputProp.addButtonCallBack}
    removeButtonCallBack={postCodeInputProp.removeButtonCallBack}
/>

describe('<PostCodeInput/>', () => {
    it('Component is rendered', () => {
        render(Component)
    });

    it('All locations are rendered', () => {
        const { container } = render(Component);
        const locations = container.querySelectorAll('li');
        expect(locations).toHaveLength(4);
    });

    it('Correct postcodes are displayed', () => {
        const { getByText } = render(Component);
        getByText('N7 9RA')
        getByText('NW5 2NJ')
        getByText('N7 2G6')
        getByText('NW4 6RF')
    });

    it('Adds and removes input display', () => {
        render(Component);
        const button = screen.getByText('-');
        userEvent.click(button);
        const notExpected = screen.queryByText('N7 9RA');
        expect(notExpected).toBe(null);
        userEvent.click(button);
        screen.getByText('N7 9RA');
    })
});