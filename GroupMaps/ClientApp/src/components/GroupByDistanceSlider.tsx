import React from 'react';

type Props = {
    maxRange: number,
    onRangeChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    distance: number
}

const GroupByDistanceSlider = (props: Props) => {
    return (
        <>
            <input type="range" min="0.0001" max={props.maxRange} value={props.distance} onChange={props.onRangeChange} />
        </>
        )
}

export default GroupByDistanceSlider;