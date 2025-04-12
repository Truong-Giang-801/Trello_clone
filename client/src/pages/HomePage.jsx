import React from 'react';
import api, { getTest } from '../services/api';

// import axios from 'axios';

async function test() {
    const res = await getTest();

    console.log(res.data);
}

const HomePage = () => {
    return (
        <div>
            <h1>Hello React!</h1>
            <button onClick={test}></button>
        </div>
    );
};

export default HomePage;
