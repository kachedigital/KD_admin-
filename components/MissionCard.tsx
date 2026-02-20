'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface MissionCardProps {
    isFocused: boolean;
    onFocusChange: (focused: boolean) => void;
}

export default function MissionCard({ isFocused, onFocusChange }: MissionCardProps) {
    const [evidenceLink, setEvidenceLink] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (evidenceLink) {
            // Simulate submission to Supabase metadata storage
            console.log('Submitted evidence:', evidenceLink);
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setEvidenceLink('');
                onFocusChange(false);
            }, 2000);
        }
    };

    return (
        <Card className={`relative z - 50 border - zinc - 800 bg - [#0a0510] text - white transition - all duration - 300 ${isFocused ? 'ring-2 ring-emerald-500 shadow-2xl shadow-emerald-900/20' : ''} `}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-500 mb-1 font-semibold">Active Mission</p>
                        <CardTitle className="font-sans text-2xl font-bold tracking-tight text-white mb-2">
                            7-Day Micro-Upskill Loop
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Complete your 15-minute daily workflow to build momentum.
                        </CardDescription>
                    </div>
                    {!isFocused && (
                        <Button
                            onClick={() => onFocusChange(true)}
                            variant="default"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            Start Task
                        </Button>
                    )}
                </div>
            </CardHeader>

            {isFocused && (
                <>
                    <CardContent>
                        <div className="space-y-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
                            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                                <h3 className="text-sm font-medium mb-2 text-zinc-300">Today's Objective</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Execute your focused upskill task. Stay locked in for the next 15 minutes.
                                    Once completed, provide proof of work below to track your progress in the vault.
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                        <form onSubmit={handleSubmit} className="w-full flex gap-3">
                            <Input
                                type="url"
                                placeholder="Paste evidence link (e.g., GitHub PR, Figma link)..."
                                value={evidenceLink}
                                onChange={(e) => setEvidenceLink(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-500 text-white flex-1"
                                required
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitted || !evidenceLink}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white whitespace-nowrap min-w-[140px]"
                            >
                                {isSubmitted ? 'Secured' : 'Submit Evidence'}
                            </Button>
                        </form>
                        <div className="w-full flex justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => onFocusChange(false)}
                                className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 text-xs h-8"
                            >
                                Abort Mission
                            </Button>
                        </div>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
