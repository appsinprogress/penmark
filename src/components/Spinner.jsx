import React from 'react';

export function Spinner({
    className
}) {

    const loaderStyle = {
        border: '5px solid #f3f3f3',
        WebkitAnimation: 'spin 1s linear infinite',
        animation: 'spin 1s linear infinite',
        borderTop: '5px solid #555',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        margin: '1em',
      };

    return <>
        <div style={loaderStyle} className={className}></div>
    </>
}