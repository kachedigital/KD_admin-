'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '@/context/ProjectContext';

const GHOST_MESSAGES = [
    { range: [0, 30], text: "GIVE ME THE FACTS." },
    { range: [31, 70], text: "DEEP BREATH. START HERE." },
    { range: [71, 100], text: "LET'S BRAINSTORM TOGETHER." }
];

export const AftermathView = () => {
    const [hasText, setHasText] = useState(false);
    const [isExitingSanctuary, setIsExitingSanctuary] = useState(false);
    const { toneValue } = useProject();
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const isCurrentRange = (range: number[]) => toneValue >= range[0] && toneValue <= range[1];

    const handleReturn = async () => {
        // 1. Fade out the Clean Slate text (400ms)
        setIsExitingSanctuary(true);

        document.documentElement.classList.add('system-waking');

        await new Promise(r => setTimeout(r, 450)); // The "Void Heartbeat"

        // Fire exit panic event after the void gap
        window.dispatchEvent(new CustomEvent('exit-panic'));

        setTimeout(() => {
            document.documentElement.classList.remove('system-paused', 'system-waking');
        }, 50); // Finish class removal synced with layout wrapper
    };

    useEffect(() => {
        // Autofocus the "Sanctuary" immediately
        inputRef.current?.focus();
    }, []);

    return (
        <div className={`sanctuary-container flex flex-col items-center justify-center h-screen w-screen px-6 transition-all ${isExitingSanctuary ? 'opacity-0 duration-400 ease-out' : 'animate-in fade-in zoom-in-95 duration-300 ease-out opacity-100 scale-100'}`}>
            {/* The Layered Text Morph Stack */}
            <div className={`relative h-6 w-full flex justify-center mb-4 transition-opacity duration-500 pointer-events-none ${hasText ? 'opacity-0' : 'opacity-100'}`}>
                {GHOST_MESSAGES.map((m, i) => (
                    <span
                        key={i}
                        className="absolute transition-opacity duration-700 ease-in-out text-[10px] tracking-[0.3em] text-slate-200"
                        style={{ opacity: isCurrentRange(m.range) ? 0.3 : 0 }}
                    >
                        {m.text}
                    </span>
                ))}
            </div>

            <textarea
                ref={inputRef}
                onChange={(e) => setHasText(e.target.value.length > 0)}
                spellCheck={false}
                className="
          w-full max-w-3xl h-[60vh] 
          bg-transparent border-none focus:ring-0 
          text-slate-200 text-xl leading-relaxed 
          resize-none caret-slate-400
          placeholder-transparent
        "
                placeholder="Start typing..."
            />

            {/* Recovery Exit - Subtle link at the bottom */}
            <button
                className="fixed bottom-8 text-slate-600 hover:text-slate-400 text-xs tracking-widest uppercase transition-colors"
                onClick={handleReturn}
            >
                Return to Command
            </button>
        </div>
    );
};
