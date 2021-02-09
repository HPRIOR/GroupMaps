import GroupByDistanceSlider from './GroupByDistanceSlider' ;
import React from 'react';
import { act, render,  screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event"

it('Renders Component', () => {
    render(<GroupByDistanceSlider />);
});

it('Renders correct correct starting value', () => {
    act(() => {
        render(<GroupByDistanceSlider distance="10" onRangeChange={() => {}} />)})
    screen.getByText("10")
});


