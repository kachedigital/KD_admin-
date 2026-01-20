'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isInitializing, setIsInitializing] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Mission requires a name.");
            return;
        }

        setIsInitializing(true);
        // 1. Initialize the project in the shared brain
        const { error } = await supabase.from('project_intelligence').insert([{
            agent_role: 'Founder',
            category: 'Project Initialization',
            content: {
                project: name,
                description: description,
                summary: `SYSTEM START: New Project "${name}" initialized.`
            },
            status: 'active'
        }]);

        if (!error) {
            toast.success(`Project ${name} initialized successfully.`);
            onClose();
            // Using refresh instead of full reload for better DX if possible, 
            // but the user asked for reload to see the new card logic (which is static in ProjectHero currently)
            window.location.reload();
        } else {
            console.error("Initialization error:", error.message);
            toast.error(`Initialization failed: ${error.message}`);
        }
        setIsInitializing(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg border-founder-desk p-8 rounded-3xl bg-[#1a161f] glow-pink">
                <h2 className="font-monument text-sm uppercase mb-6 tracking-widest text-white">Initialize New Project</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block tracking-widest">Project Callsign</label>
                        <input
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-kache-cyan transition-all"
                            placeholder="e.g., Kache Marketplace"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block tracking-widest">Mission Parameters</label>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-kache-cyan transition-all resize-none"
                            placeholder="Define project scope and objectives..."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-[10px] font-monument border border-white/10 rounded-xl hover:bg-white/5 transition-all text-gray-400"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isInitializing}
                        className="flex-1 py-3 text-[10px] font-monument bg-kache-cyan text-black rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {isInitializing ? 'INITIALIZING...' : 'START MISSION'}
                    </button>
                </div>
            </div>
        </div>
    );
}
