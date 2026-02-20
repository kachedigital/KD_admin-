"use client";

import React, { useState } from 'react';
import { ArrowUpRight, Chrome, Droplet, FileIcon } from 'lucide-react';

interface AssetStripProps {
    asset: {
        name: string;
        provider: 'google' | 'dropbox' | 'local';
    };
    index: number;
    glowColor?: string;
}

const ProviderIcon = ({ provider, className }: { provider: string, className?: string }) => {
    switch (provider) {
        case 'google': return <Chrome className={className} />;
        case 'dropbox': return <Droplet className={className} />;
        default: return <FileIcon className={className} />;
    }
};

export const AssetStrip = ({ asset, index, glowColor = '#3B82F6' }: AssetStripProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Optimistic Shimmer handler for action dispatch
    const injectToAgent = async (item: any) => {
        setIsProcessing(true);
        console.log(`[Asset Relay] Sending ${item.name} metadata block to Agent.`);

        // Simulating Agent ingest delay
        await new Promise(r => setTimeout(r, 600));
        setIsProcessing(false);
    };

    return (
        <div
            className="group flex items-center justify-between py-2 px-3 border-b-[0.5px] border-slate-800/30 hover:bg-white/5 transition-colors cursor-pointer animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-both"
            style={{
                animationDelay: `${index * 30}ms`,
                '--hover-color': glowColor
            } as React.CSSProperties}
        >
            <div className="flex items-center gap-2 truncate">
                <ProviderIcon provider={asset.provider} className="w-3.5 h-3.5 stroke-[0.5px] text-slate-500" />
                <span className="text-xs text-slate-300 truncate font-medium">{asset.name}</span>
            </div>

            {/* The Deep Action "Whisper" with Shimmer state */}
            <button
                onClick={() => injectToAgent(asset)}
                disabled={isProcessing}
                className={`flex items-center justify-center p-1 rounded transition-all duration-300 pointer-events-auto
                    ${isProcessing
                        ? 'opacity-100 bg-slate-800 animate-pulse'
                        : 'opacity-0 group-hover:opacity-40 hover:opacity-100 hover:bg-slate-800'
                    }`}
            >
                <ArrowUpRight size={14} className={`${isProcessing ? 'text-[var(--hover-color)]' : 'hover:text-[var(--hover-color)]'} transition-colors duration-200`} />
            </button>
        </div>
    );
};
