import React from 'react';
import ThemeToggle from '../../Components/ThemeToggle/ThemeToggle';

const Home = () => {
    return (
        <div>
            this is home
            <button className='btn text-yellow-300 bg-primary hover:brightness-90'>hi</button>
            <p className='bg-secondary'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quis quae saepe et magni officia, consequatur aliquid. Consequuntur maxime placeat fugit vitae sunt necessitatibus, exercitationem facilis cupiditate, odit omnis culpa!</p>
            <ThemeToggle></ThemeToggle>
        </div>
    );
};

export default Home;