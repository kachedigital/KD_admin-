"use client";

import React, { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap } from 'lucide-react';
import { useVault } from '@/store/vault'; // Assumed from encryption layer specs

interface Step2Props {
    onComplete: () => void;
}

export default function Step2_ModelSelect({ onComplete }: Step2Props) {
    const [modelType, setModelType] = useState('strategic');
    const [isSaving, setIsSaving] = useState(false);
    const { saveMeta } = useVault(); // We utilize the meta field for preferences per specs

    const handleComplete = async () => {
        setIsSaving(true);
        try {
            // Save user intent mode to the encrypted state bucket or standard state
            await saveMeta({ agentMode: modelType });
            // Short delay to simulate writing state intentionally
            await new Promise(r => setTimeout(r, 600));
            onComplete();
        } catch (err) {
            console.error("Failed to commit model state.", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center">

            <div className="mb-8 flex flex-col items-center">
                <h2 className="font-monument text-lg uppercase tracking-widest text-[#E2E8F0] mb-2">
                    SELECT COGNITION REGIME
                </h2>
                <p className="text-sm text-[#94A3B8] font-poppins text-center px-4">
                    Choose the primary operating mode for the Reslivin Core. This dictates the backend routing payload.
                </p>
            </div>

            <RadioGroup.Root
                className="flex flex-col gap-4 w-full mb-8"
                defaultValue="strategic"
                aria-label="Agent Model Selection"
                onValueChange={setModelType}
            >
                <RadioGroup.Item
                    value="strategic"
                    id="r1"
                    className={`
            relative flex items-start gap-4 p-5 rounded-lg border text-left transition-all outline-none
            ${modelType === 'strategic'
                            ? 'bg-[#1E1E1F]/50 border-[#0CC0DF] shadow-[inset_0_0_20px_rgba(12,192,223,0.1)]'
                            : 'bg-[#0A0A0A] border-[#1E293B] hover:border-[#334155]'
                        }
          `}
                >
                    <div className={`mt-1 flex-shrink-0 ${modelType === 'strategic' ? 'text-[#0CC0DF]' : 'text-[#64748B]'}`}>
                        <BrainCircuit size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-bold tracking-wider uppercase text-sm mb-1 ${modelType === 'strategic' ? 'text-white' : 'text-[#94A3B8]'}`}>
                            Strategic (Default)
                        </span>
                        <span className="text-xs text-[#64748B] leading-relaxed">
                            Deep thinking, analysis, and architecture. Optimized for GPT-4o and Gemini 3.1 Pro pipelines.
                        </span>
                    </div>

                    <RadioGroup.Indicator className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#0CC0DF]" />
                </RadioGroup.Item>

                <RadioGroup.Item
                    value="fast"
                    id="r2"
                    className={`
            relative flex items-start gap-4 p-5 rounded-lg border text-left transition-all outline-none
            ${modelType === 'fast'
                            ? 'bg-[#1E1E1F]/50 border-[#FF8D55] shadow-[inset_0_0_20px_rgba(255,141,85,0.1)]'
                            : 'bg-[#0A0A0A] border-[#1E293B] hover:border-[#334155]'
                        }
          `}
                >
                    <div className={`mt-1 flex-shrink-0 ${modelType === 'fast' ? 'text-[#FF8D55]' : 'text-[#64748B]'}`}>
                        <Zap size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-bold tracking-wider uppercase text-sm mb-1 ${modelType === 'fast' ? 'text-white' : 'text-[#94A3B8]'}`}>
                            Fast Utility
                        </span>
                        <span className="text-xs text-[#64748B] leading-relaxed">
                            Quick executions, drafting, and rapid responses. Optimized for speed and low token cost routines.
                        </span>
                    </div>

                    <RadioGroup.Indicator className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#FF8D55]" />
                </RadioGroup.Item>
            </RadioGroup.Root>

            <button
                onClick={handleComplete}
                disabled={isSaving}
                className={`
            w-full py-3 rounded-lg font-bold tracking-wider text-sm transition-all
            ${isSaving
                        ? 'bg-[#1E293B] text-[#475569] cursor-not-allowed'
                        : 'bg-[#F8FAFC] text-[#050505] hover:bg-[#E2E8F0] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    }
        `}
            >
                {isSaving ? (
                    <span className="animate-pulse">COMMITTING STATE...</span>
                ) : (
                    'INITIALIZE VAULT'
                )}
            </button>

        </div>
    );
}
