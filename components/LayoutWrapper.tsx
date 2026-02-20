"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ShutterWrapper } from './ui/shutter-wrapper';
import { useAudio } from '@/hooks/use-audio';
import { AftermathView } from './dashboard/AftermathView';
import { PanicButton } from './PanicButton';

interface LayoutContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (v: boolean) => void;
    isFocusMode: boolean;
    toggleFocus: () => void;
    triggerShutter: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) throw new Error("useLayout must be used within LayoutWrapper");
    return context;
}

import { cn } from '@/lib/utils';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isShutterActive, setIsShutterActive] = useState(false);
    const [showCloseHint, setShowCloseHint] = useState(false);
    const [panicMode, setPanicMode] = useState(false);
    const [renderSanctuary, setRenderSanctuary] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const { playThud } = useAudio();
    const prevFocusMode = useRef(isFocusMode);

    useEffect(() => {
        if (prevFocusMode.current !== isFocusMode) {
            playThud();
            prevFocusMode.current = isFocusMode;
        }
    }, [isFocusMode, playThud]);

    const toggleFocus = () => {
        setIsShutterActive(true); // Trigger 100ms dip

        setTimeout(() => {
            // Hard-switch state at peak darkness (50ms)
            const nextFocusMode = !isFocusMode;
            setIsFocusMode(nextFocusMode);
            document.body.style.backgroundColor = !nextFocusMode ? "#05010a" : "#0A0A0A";
        }, 50);

        setTimeout(() => setIsShutterActive(false), 200);
    };

    const triggerShutter = () => {
        setIsShutterActive(true);
        setTimeout(() => setIsShutterActive(false), 200);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFocusMode) {
                toggleFocus();
                setShowCloseHint(true);
                setTimeout(() => setShowCloseHint(false), 3000);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocusMode]);

    useEffect(() => {
        const handleExitPanic = () => {
            // 2. Hard reset state
            setRenderSanctuary(false);
            setPanicMode(false);
            setIsFocusMode(true); // Mandatory Safe Mode
            setIsRecovering(true); // Triggers the 2.5s soak
            document.body.style.backgroundColor = "#05010a";

            setTimeout(() => setIsRecovering(false), 2500);
        };
        window.addEventListener('exit-panic', handleExitPanic as EventListener);
        return () => window.removeEventListener('exit-panic', handleExitPanic as EventListener);
    }, []);

    const triggerPanic = () => {
        setPanicMode(true);
        setTimeout(() => setRenderSanctuary(true), 150);
    };

    if (renderSanctuary) {
        return <AftermathView />;
    }

    return (
        <LayoutContext.Provider value={{ isSidebarOpen, setIsSidebarOpen, isFocusMode, toggleFocus, triggerShutter }}>
            <div
                className={cn(
                    "flex h-screen bg-[#05010a] text-white overflow-hidden transition-all transform origin-center",
                    panicMode ? "duration-150 ease-in opacity-0 scale-95 panic-exit system-paused" : "duration-300 opacity-100 scale-100",
                    isRecovering ? "animate-acclimatize" : ""
                )}
                style={{ '--sidebar-width': isSidebarOpen ? '16rem' : '5rem' } as React.CSSProperties}
            >
                {/* Focus Overlay */}
                {isFocusMode && (
                    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xl transition-all duration-500 pointer-events-none" />
                )}

                {showCloseHint && (
                    <div className="fixed top-4 right-4 z-[110] bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                        Focus Mode Disabled
                    </div>
                )}

                <ShutterWrapper isFocus={isFocusMode} isActive={isShutterActive}>
                    {children}
                </ShutterWrapper>

                <PanicButton onPanic={triggerPanic} />
            </div>
        </LayoutContext.Provider>
    );
}

