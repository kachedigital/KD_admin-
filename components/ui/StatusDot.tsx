import React from 'react';

export const StatusDot = ({ glowColor }: { glowColor: string }) => (
    <div className="relative flex h-2 w-2">
        <div
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{
                animationIterationCount: 2,
                animationFillMode: 'forwards',
                backgroundColor: glowColor
            }}
        />
        <div
            className="relative inline-flex h-2 w-2 rounded-full transition-shadow duration-500"
            style={{
                backgroundColor: glowColor,
                boxShadow: `0 0 8px ${glowColor}`
            }}
        />
    </div>
);
