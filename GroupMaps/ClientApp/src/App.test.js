import App from './App';
import React from 'react';
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event"
import { getByText, queryByText } from "@testing-library/react"

let container = null
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null
});

it('App renders', () => {
    render(<App />, container)
});

it('Displays input post code - mock fetch', async () => {
    const fakePostCode = {
        "status": 200,
        "result": {
            "postcode": "N7 9RA",
            "quality": 1,
            "eastings": 530690,
            "northings": 185615,
            "country": "England",
            "nhs_ha": "London",
            "longitude": -0.116337,
            "latitude": 51.554291,
            "european_electoral_region": "London",
            "primary_care_trust": "Islington",
            "region": "London",
            "lsoa": "Islington 011D",
            "msoa": "Islington 011",
            "incode": "9RA",
            "outcode": "N7",
            "parliamentary_constituency": "Islington South and Finsbury",
            "admin_district": "Islington",
            "parish": "Islington, unparished area",
            "admin_county": null,
            "admin_ward": "Holloway",
            "ced": null,
            "ccg": "NHS North Central London",
            "nuts": "Haringey and Islington",
            "codes": {
                "admin_district": "E09000019",
                "admin_county": "E99999999",
                "admin_ward": "E05000375",
                "parish": "E43000209",
                "parliamentary_constituency": "E14000764",
                "ccg": "E38000240",
                "ccg_id": "93C",
                "ced": "E99999999",
                "nuts": "UKI43",
                "lsoa": "E01002767",
                "msoa": "E02000564",
                "lau2": "E05000375"
            }
        }
    }
    // mock postCode fetch from API
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(fakePostCode) }))
    act(() => {
        render(<App />, container)
    });
    const postCodeInput = container.querySelector('#post-code-input');
    const postCodeButton = container.querySelector('#add-post-code');

    await act(async () => {
        await userEvent.type(postCodeInput, "N7 9RA")
        userEvent.click(postCodeButton)
    });

    getByText(container, "N7 9RA")
});

it('Remove button removes postcode', async () => {
    const fakePostCode = {
        "status": 200,
        "result": {
            "postcode": "N7 9RA",
            "quality": 1,
            "eastings": 530690,
            "northings": 185615,
            "country": "England",
            "nhs_ha": "London",
            "longitude": -0.116337,
            "latitude": 51.554291,
            "european_electoral_region": "London",
            "primary_care_trust": "Islington",
            "region": "London",
            "lsoa": "Islington 011D",
            "msoa": "Islington 011",
            "incode": "9RA",
            "outcode": "N7",
            "parliamentary_constituency": "Islington South and Finsbury",
            "admin_district": "Islington",
            "parish": "Islington, unparished area",
            "admin_county": null,
            "admin_ward": "Holloway",
            "ced": null,
            "ccg": "NHS North Central London",
            "nuts": "Haringey and Islington",
            "codes": {
                "admin_district": "E09000019",
                "admin_county": "E99999999",
                "admin_ward": "E05000375",
                "parish": "E43000209",
                "parliamentary_constituency": "E14000764",
                "ccg": "E38000240",
                "ccg_id": "93C",
                "ced": "E99999999",
                "nuts": "UKI43",
                "lsoa": "E01002767",
                "msoa": "E02000564",
                "lau2": "E05000375"
            }
        }
    }
    // mock postCode fetch from API
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(fakePostCode) }))
    act(() => {
        render(<App />, container)
    });
    const postCodeInput = container.querySelector('#post-code-input');
    const addButton = container.querySelector('#add-post-code');

    await act(async () => {
        await userEvent.type(postCodeInput, "N7 9RA")
        userEvent.click(addButton)
    });

    getByText(container, 'N7 9RA')
    const removeButton = container.querySelectorAll('.remove-post-code')[0];
    act(() => {
        userEvent.click(removeButton);
    })

    const tryGetRemovedPostCode = queryByText(container, 'N7 9RA')
    expect(tryGetRemovedPostCode).toBeNull();
});

it('Add empty does nothing', async () => {
    const fakePostCode = {
        "status": 200,
        "result": {
            "postcode": "N7 9RA",
            "quality": 1,
            "eastings": 530690,
            "northings": 185615,
            "country": "England",
            "nhs_ha": "London",
            "longitude": -0.116337,
            "latitude": 51.554291,
            "european_electoral_region": "London",
            "primary_care_trust": "Islington",
            "region": "London",
            "lsoa": "Islington 011D",
            "msoa": "Islington 011",
            "incode": "9RA",
            "outcode": "N7",
            "parliamentary_constituency": "Islington South and Finsbury",
            "admin_district": "Islington",
            "parish": "Islington, unparished area",
            "admin_county": null,
            "admin_ward": "Holloway",
            "ced": null,
            "ccg": "NHS North Central London",
            "nuts": "Haringey and Islington",
            "codes": {
                "admin_district": "E09000019",
                "admin_county": "E99999999",
                "admin_ward": "E05000375",
                "parish": "E43000209",
                "parliamentary_constituency": "E14000764",
                "ccg": "E38000240",
                "ccg_id": "93C",
                "ced": "E99999999",
                "nuts": "UKI43",
                "lsoa": "E01002767",
                "msoa": "E02000564",
                "lau2": "E05000375"
            }
        }
    }
    // mock postCode fetch from API
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(fakePostCode) }))
    act(() => {
        render(<App />, container)
    });
    const postCodeButton = container.querySelector('#add-post-code');

    act(() => {
        userEvent.click(postCodeButton)
    });

    const tryGetRemovedPostCode = queryByText(container, 'N7 9RA')
    expect(tryGetRemovedPostCode).toBeNull();
});