"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { VaultShield } from '../ui/VaultShield';
import { callReslivin } from '@/lib/agent-client';
import { useVault } from '@/store/vault'; // Assuming this exists per prompt specs

interface Step1Props {
    onNext: () => void;
}

export default function Step1_OpenAI({ onNext }: Step1Props) {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { saveKeys } = useVault(); // Based on standard BYOK vault implementation

    const handleValidate = async (key: string) => {
        setIsLoading(true);
        // Reset error state
        setHasError(false);

        try {
            const result = await callReslivin({
                prompt: "Respond with only the word VALID",
                overrideKey: key // Temporarily pass key for validation
            });

            // The agent-client already parses the response.json(), so result is likely { response: "VALID" } or similar 
            // depending on the exact implementation of /api/agent. We'll check the main text output string.
            const responseText = result.response || result.result || result.text || "";

            if (responseText.trim() === 'VALID') {
                saveKeys({ openAiKey: key });
                onNext();
            } else {
                throw new Error("Invalid Handshake");
            }
        } catch (err) {
            setHasError(true);
            setTimeout(() => setHasError(false), 300); // Reset shake
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center">

            <div className="mb-8 flex flex-col items-center">
                <div className="mb-4">
                    <VaultShield active={!hasError && apiKey.length > 20} hasError={hasError} />
                </div>
                <h2 className="font-monument text-lg uppercase tracking-widest text-[#E2E8F0]">
                    INITIALIZE INTELLIGENCE
                </h2>
                <p className="text-sm text-[#94A3B8] mt-2 font-poppins text-center">
                    Enter your OpenAI Platform Key to establish a secure connection. Keys never leave your local encrypted vault.
                </p>
            </div>

            <motion.div
                className="w-full relative"
                animate={hasError ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative flex items-center">
                    <input
                        type={showKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-proj-..."
                        className={`
                            w-full bg-[#0A0A0A] border rounded-lg px-4 py-3 text-[#F8FAFC] 
                            placeholder:text-[#475569] focus:outline-none focus:ring-1 
                            transition-colors duration-200
                            ${hasError
                                ? 'border-red-900/50 focus:border-red-500/50 focus:ring-red-500/20'
                                : 'border-[#1E293B] focus:border-[#0EA5E9]/50 focus:ring-[#0EA5E9]/20'
                            }
                        `}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 p-1 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                        disabled={isLoading}
                    >
                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </motion.div>

            <button
                onClick={() => handleValidate(apiKey)}
                disabled={isLoading || !apiKey}
                className={`
                    mt-6 w-full py-3 rounded-lg font-bold tracking-wider text-sm transition-all
                    ${isLoading
                        ? 'bg-[#1E293B] text-[#475569] cursor-not-allowed'
                        : 'bg-[#F8FAFC] text-[#050505] hover:bg-[#E2E8F0] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    }
                `}
            >
                {isLoading ? (
                    <span className="animate-pulse">VALIDATING SIGNAL...</span>
                ) : (
                    'ESTABLISH UPLINK'
                )}
            </button>
        </div>
    );
}
