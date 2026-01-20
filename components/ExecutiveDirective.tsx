'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { triggerAgentResponse } from '@/lib/agent-logic';

const AGENTS = [
    'Store Architect', 'Product Architect', 'CFO Agent',
    'Marketing Manager', 'CRM Manager', 'Operations Manager',
    'QA Analyst', 'Security Warden'
];

export default function ExecutiveDirective() {
    const [directive, setDirective] = useState('');
    const [projects, setProjects] = useState<string[]>(['KacheDigital Store', 'Career Command Center', 'KD_HQ']);
    const [selectedProject, setSelectedProject] = useState('KacheDigital Store');
    const [targetAgent, setTargetAgent] = useState(AGENTS[0]);
    const [isSending, setIsSending] = useState(false);
    const [isTransmitting, setIsTransmitting] = useState(false);

    // Dynamic project fetching
    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from('project_intelligence')
                .select('content');

            if (data) {
                const uniqueProjects = Array.from(new Set(data.map(d => d.content?.project))).filter(Boolean) as string[];
                const merged = Array.from(new Set(['KacheDigital Store', 'Career Command Center', 'KD_HQ', ...uniqueProjects]));
                setProjects(merged);
            }
        };

        fetchProjects();
        const channel = supabase.channel('directive_project_sync')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_intelligence' }, fetchProjects)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!directive.trim()) return;

        setIsSending(true);
        const { error } = await supabase.from('project_intelligence').insert([
            {
                agent_role: 'Founder',
                category: 'Direct Order',
                content: {
                    target: targetAgent,
                    project: selectedProject,
                    message: directive,
                    summary: `Directive: ${directive.substring(0, 40)}...`
                },
                status: 'active'
            },
        ]);

        if (!error) {
            toast.success("Directive transmitted successfully");

            // Trigger simulated agent cognitive response
            await triggerAgentResponse(targetAgent, selectedProject, directive);

            setDirective('');
            setIsTransmitting(true);
            setTimeout(() => setIsTransmitting(false), 2000);
        } else {
            console.error("Supabase sync error:", error.message);
            toast.error(`Transmission failed: ${error.message}`);
        }
        setIsSending(false);
    };

    return (
        <div className={cn(
            "w-full border-founder-desk p-8 rounded-2xl bg-[#1a161f]/95 transition-all duration-700",
            isTransmitting ? "animate-signal" : "glow-pink"
        )}>
            <div className="flex items-center gap-2 mb-6">
                <span className="text-kache-pink text-sm">⚡</span>
                <h2 className="font-monument text-[10px] uppercase tracking-[0.3em] text-white">Founder&apos;s Command Desk</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Selector */}
                    <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black mb-2 block">Target Project</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-kache-cyan transition-all"
                        >
                            {projects.map(p => <option key={p} className="bg-[#1E1E1F]" value={p}>{p}</option>)}
                        </select>
                    </div>

                    {/* Agent Selector */}
                    <div>
                        <label className="text-[10px] text-gray-400 uppercase font-black mb-2 block">Assign Agent</label>
                        <select
                            value={targetAgent}
                            onChange={(e) => setTargetAgent(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-kache-cyan transition-all"
                        >
                            {AGENTS.map(a => <option key={a} className="bg-[#1E1E1F]" value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>

                {/* Command Input */}
                <div>
                    <label className="text-[10px] text-gray-400 uppercase font-black mb-2 block">Strategic Intent</label>
                    <textarea
                        className="w-full p-5 bg-black/40 rounded-xl border border-white/5 focus:border-kache-pink/50 outline-none transition-all text-sm text-gray-200 font-mono"
                        placeholder="Enter Executive Intent..."
                        value={directive}
                        onChange={(e) => setDirective(e.target.value)}
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSending || !directive.trim()}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-monument text-[10px] tracking-widest transition-all text-white disabled:opacity-50"
                >
                    {isSending ? 'TRANSMITTING...' : 'BROADCAST INTENT 🛰️'}
                </button>
            </form>
        </div>
    );
}
