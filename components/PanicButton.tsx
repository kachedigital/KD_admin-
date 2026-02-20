"use client";

import React from 'react';

// Junior: This is a static anchor. No pulses. No glows.
export const PanicButton = ({ onPanic }: { onPanic: () => void }) => {
    return (
        <button
            onClick={onPanic}
            className="
        fixed bottom-8 right-8 z-[100]
        px-6 py-3 rounded-md
        bg-[#B91C1C] text-white 
        font-bold uppercase tracking-tighter
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
        border-b-4 border-[#7F1D1D]
        active:border-b-0 active:translate-y-[2px]
        transition-all duration-75
        focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:ring-offset-2 focus:ring-offset-[#050505]
      "
        >
            Panic Reset
        </button>
    );
};
