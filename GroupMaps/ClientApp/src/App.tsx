import React from 'react';
import GoogleMap from './components/GoogleMap';
import './styles/App.css'
import getMapsApiKey from './GetApiKey'

const App = () => {

    return (
        <div id="main-window">
            <GoogleMap apiKey={getMapsApiKey()} center={{ lat: 50.736129, lng: -1.98822 }} />
        </div>
        )
}

export default App;
