import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground: React.FC = () => {
    const bubbles = Array.from({ length: 25 });

    return (
        <div className="background-wrapper">
            <div className="stars"></div>
            <ul className="bubbles">
                {bubbles.map((_, index) => (
                    <li key={index}></li>
                ))}
            </ul>
        </div>
    );
};

export default AnimatedBackground;
