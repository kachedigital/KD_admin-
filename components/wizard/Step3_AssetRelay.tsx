"use client";

import React, { useState } from 'react';
import { CloudShield } from '../ui/CloudShield';
import { useLayout } from '../LayoutWrapper';
import { fetchRecentAssets } from '@/lib/metadata-relay';
import { OAuthButton } from './OAuthRelay';
import { motion } from 'framer-motion';

interface Step3Props {
    onComplete: () => void;
}

export default function Step3_AssetRelay({ onComplete }: Step3Props) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const { triggerShutter } = useLayout();

    const handleConnectOAuth = async (provider: 'google' | 'dropbox') => {
        setIsConnecting(true);

        // 1. Simulate the OAuth Popup / Relay Handshake
        await new Promise(r => setTimeout(r, 1200));

        // 2. Trigger "100ms dip" UI pattern (Shutter Sync)
        triggerShutter();

        // 3. Lock on to new Data Source after the dark shutter peak (50-100ms offset)
        setTimeout(async () => {
            setIsConnected(true);
            await fetchRecentAssets(provider, 'mock-oauth-token');
            setIsConnecting(false);

            // 4. Conclude the wizard
            setTimeout(() => {
                onComplete();
            }, 800);
        }, 120); // Syncing closely with the shutter peak
    };

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
            <div className="mb-8 flex flex-col items-center">
                <h2 className="font-monument text-lg uppercase tracking-widest text-[#E2E8F0] mb-2">
                    ASSET RELAY INTEGRATION
                </h2>
                <p className="text-sm text-[#94A3B8] font-poppins text-center px-4">
                    Link your intelligence stores. We exclusively index metadata and secure links to preserve your local data sovereignty.
                </p>
            </div>

            <div className="w-full flex flex-col gap-4">
                <OAuthButton
                    provider="google"
                    isConnected={isConnected}
                    onConnect={() => handleConnectOAuth('google')}
                />
                <OAuthButton
                    provider="dropbox"
                    isConnected={false}
                    onConnect={() => { }}
                />
            </div>

            <div className="mt-8 text-center text-xs text-[#64748B]">
                Only "Starred" or "Modified (7d)" items will be indexed initially.
            </div>

        </div>
    );
}
