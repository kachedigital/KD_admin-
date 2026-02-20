"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function NotepadOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Load from local storage (zero-server-trip)
        const saved = localStorage.getItem('kache-notepad');
        if (saved) setContent(saved);

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        localStorage.setItem('kache-notepad', newContent);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-3xl bg-[#0a0510]/95 border border-zinc-800 shadow-2xl text-white transform transition-all">
                <CardHeader className="border-b border-zinc-800 pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-sans uppercase tracking-[0.2em] text-emerald-500">
                        Sovereign Scratchpad
                        <span className="text-xs text-zinc-500 ml-3 normal-case tracking-normal font-sans">
                            Press Esc to close
                        </span>
                    </CardTitle>
                    <div className="text-xs text-zinc-600 font-mono">Local State Only</div>
                </CardHeader>
                <CardContent className="p-0">
                    <Textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleChange}
                        placeholder="Markdown notes..."
                        className="w-full h-[60vh] md:h-[500px] border-0 bg-transparent resize-none focus-visible:ring-0 p-6 text-zinc-300 font-mono text-sm leading-relaxed"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
