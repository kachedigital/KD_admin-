'use client';

import { useCallback } from 'react';

// low-pass "thud" effect (a short, lower frequency beep encoded as base64 webm/mp3/ogg)
// For demonstration, here's a short minimal base64 sound (a tiny pop/thud).
const THUD_BASE_64 = 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

export const useAudio = () => {
    const playThud = useCallback(() => {
        try {
            if (typeof window !== 'undefined') {
                const isHapticEnabled = localStorage.getItem('kache_haptics') === 'true';
                if (isHapticEnabled) {
                    const audio = new Audio(THUD_BASE_64);
                    audio.volume = 0.5; // low, subtle thud
                    audio.play().catch(console.error);
                }
            }
        } catch (e) {
            console.error('Audio playback failed', e);
        }
    }, []);

    return { playThud };
};
