import React from 'react';

import PropTypes from 'prop-types';
import './SkeletonLoader.css';

export default function SkeletonLoader({ lines = 3, className = '' }) {
    return (
        <div className={`skeleton-container ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className='skeleton-line'
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                ></div>
            ))}
        </div>
    );
}

SkeletonLoader.propTypes = {
    lines: PropTypes.number,
    className: PropTypes.string,
};
