import React from 'react';
import Location from '../ObjectTypes/Location';

type Props = {
    locations: Location[],
    postcode: string,
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement> ) => void,
    addButtonCallBack: () => void,
    removeButtonCallBack: (id: string) => void
}

const PostCodeInput = (props: Props) => {
    return (
        <div>
            <ul>
                {
                    props.locations.map(i => (
                        <li key={i.id}>
                            {i.postcode}
                            <button type="button" onClick={() => props.removeButtonCallBack(i.id)}>remove</button>
                        </li>
                    ))
                }
            </ul>
            <input type="text" value={props.postcode} onChange={props.handleInputChange}></input>
            <button type="button" onClick={props.addButtonCallBack}>add</button>
        </div>
    )
}

export default PostCodeInput;
