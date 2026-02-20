"use client";

import React from 'react';
import { CloudShield } from '../ui/CloudShield';
import { Chrome } from 'lucide-react'; // Fallback icon

interface OAuthButtonProps {
    provider: 'google' | 'dropbox';
    onConnect: () => void;
    isConnected: boolean;
}

const ProviderIcon = ({ provider, className }: { provider: string, className?: string }) => {
    // In a full implementation, swap Chrome with specific brand SVG paths
    return <Chrome className={className} strokeWidth={1.5} />;
}

export const OAuthButton = ({ provider, onConnect, isConnected }: OAuthButtonProps) => {
    return (
        <button
            onClick={onConnect}
            disabled={isConnected}
            className={`
        flex items-center justify-between w-full p-4 rounded-xl border-[0.5px]
        transition-all duration-500 ease-in-out
        ${isConnected
                    ? 'bg-[#0A0A0A] border-blue-500/50 scale-[0.98] shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                    : 'bg-slate-900 border-slate-800 hover:border-blue-500/50'}
      `}
        >
            <div className="flex items-center gap-3">
                {/* Monochrome Google/Dropbox Icon */}
                <ProviderIcon provider={provider} className="w-5 h-5 text-slate-200" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-200">
                    {isConnected ? `${provider} Docked` : `Connect ${provider}`}
                </span>
            </div>
            <CloudShield active={isConnected} />
        </button>
    );
};
