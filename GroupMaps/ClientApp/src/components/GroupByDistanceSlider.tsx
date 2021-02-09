import React from 'react';

type Props = {
    maxRange: number,
    onRangeChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    distance: number
}
/*
 * things to consider:
 * Max range will be the max distance between any point
 * the slider should be disabled when there are no locations 
 * step interval should change depending on the max distance
 * 
 */

const GroupByDistanceSlider = (props: Props) => {
    return (
        <>
            <input type="range" min="0.0001" max={props.maxRange} value={props.distance} onChange={props.onRangeChange} step='any' />
            <>{props.distance}</>
        </>
    );
}

export default GroupByDistanceSlider;