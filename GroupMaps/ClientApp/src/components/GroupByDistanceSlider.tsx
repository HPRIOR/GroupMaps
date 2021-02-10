import React, { useState } from 'react';

type Props = {
    maxRange: number,
    onClick: (sliderValue: string) => void,
}
/*
 * things to consider:
 * Max range will be the max distance between any point
 * the slider should be disabled when there are no locations
 * step interval should change depending on the max distance
 *
 */

const GroupByDistanceSlider = (props: Props) => {
    const [sliderValue, setSliderValue] = useState("");
    return (
        <div>
            <input type="range" min="0.000001" max={props.maxRange} onChange={e => setSliderValue(e.target.value)} value={sliderValue} step='any' />
            <button onClick={() => props.onClick(sliderValue)} type="button">Change group distance</button>
            <>{sliderValue}</>
        </div>
    );
}

export default GroupByDistanceSlider;