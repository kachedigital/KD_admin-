// components/MissionBriefingHero.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Agent {
    id: number;
    name: string;
    role: string;
    color: string;
    icon: string;
    status: string;
    lastUpdate: string;
}

interface IntelligenceLog {
    id: string;
    created_at: string;
    agent_role: string;
    log_message?: string;
    content?: {
        summary?: string;
        message?: string;
        target?: string;
    };
}

// 1. Agent Configuration Strategy
const AGENT_CONFIG = [
    { id: 1, name: 'Store Architect', role: 'Infrastructure', color: '#0CC0DF', icon: '🏗️' },
    { id: 2, name: 'Product Architect', role: 'Blueprints', color: '#FF24E9', icon: '🎨' },
    { id: 3, name: 'CFO Agent', role: 'Finance', color: '#FF8D55', icon: '💰' },
    { id: 4, name: 'Marketing Manager', role: 'Growth', color: '#FE696E', icon: '📢' },
    { id: 5, name: 'CRM Manager', role: 'Relations', color: '#1D90A5', icon: '🤝' },
    { id: 6, name: 'Operations Manager', role: 'Workflow', color: '#6B2BD8', icon: '⚙️' },
    { id: 7, name: 'QA Analyst', role: 'Quality', color: '#0CC0DF', icon: '🔍' },
    { id: 8, name: 'Security Warden', role: 'Protection', color: '#FE696E', icon: '🛡️' }
];

export default function MissionBriefingHero() {
    const [agents, setAgents] = useState<Agent[]>(
        AGENT_CONFIG.map(a => ({ ...a, status: 'Initializing...', lastUpdate: '' }))
    );
    const [processingAgent, setProcessingAgent] = useState<string | null>(null);

    const getStatusText = (log: IntelligenceLog) => {
        return log.log_message || log.content?.summary || log.content?.message || 'Updated';
    };

    // 2. The Neural Listener (Real-time Logic)
    useEffect(() => {
        // Initial fetch to populate cards
        const fetchHistory = async () => {
            const { data } = await supabase
                .from('project_intelligence')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                updateLocalAgents(data as IntelligenceLog[]);
            }
        };

        fetchHistory();

        // Real-time subscription
        const channel = supabase
            .channel('room:hq:intelligence')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'project_intelligence' },
                (payload) => {
                    const newLog = payload.new as IntelligenceLog;
                    console.log('Brain Update:', newLog);

                    // If a Founder sends an order, pulse the target agent
                    if (newLog.agent_role === 'Founder' && newLog.content?.target) {
                        setProcessingAgent(newLog.content.target);
                        setTimeout(() => setProcessingAgent(null), 5000); // Pulse for 5 seconds
                    }

                    // Update the specific agent card that just posted
                    setAgents(prev => prev.map(agent =>
                        agent.name === newLog.agent_role
                            ? { ...agent, status: getStatusText(newLog), lastUpdate: newLog.created_at }
                            : agent
                    ));
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const updateLocalAgents = (logs: IntelligenceLog[]) => {
        setAgents(prev => prev.map(agent => {
            const latest = logs.find(l => l.agent_role === agent.name);
            return latest ? { ...agent, status: getStatusText(latest), lastUpdate: latest.created_at } : agent;
        }));
    };

    const sendDirective = async (agentName: string, note: string, project = 'KacheDigital Store') => {
        if (!note.trim()) return;

        const { error } = await supabase.from('project_intelligence').insert([{
            agent_role: 'Founder',
            category: 'Direct Order',
            content: {
                target: agentName,
                message: note,
                project: project, // This ensures it shows up in the new Hero cards!
                summary: `Order: ${note.substring(0, 30)}...`
            },
            status: 'active'
        }]);

        if (error) {
            console.error("Supabase Sync Error:", error.message);
            toast.error(`Transmission failed: ${error.message}`);
        } else {
            console.log("Directive successfully stored in Shared Brain.");
            toast.success(`Directive transmitted to ${agentName}`);
        }
    };

    return (
        <section className="relative p-10 rounded-3xl mb-12 overflow-hidden glass-card border border-white/10">
            <img src="/KD_brandkit/wideribbon_fus.png" className="absolute top-0 right-0 w-1/2 opacity-10 pointer-events-none" alt="" />

            <div className="relative z-10">
                <h1 className="cyber-text text-5xl mb-10">Kache Digital Command</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            className={cn(
                                "bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-kache-pink transition-all duration-500 flex flex-col group",
                                processingAgent === agent.name ? "animate-neural border-kache-cyan scale-[1.02]" : ""
                            )}
                        >
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl group-hover:scale-125 transition-transform">{agent.icon}</span>
                                    <div>
                                        <h3 className="font-monument text-[12px] text-white">{agent.name}</h3>
                                        <p className="text-[9px] text-kache-cyan uppercase tracking-widest">{agent.role}</p>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
                            </div>

                            <div className="p-5 flex-grow bg-black/20 min-h-[80px]">
                                <span className="text-[9px] text-gray-500 uppercase font-bold mb-1 block">Latest Intel</span>
                                <p className="text-xs text-gray-200 italic line-clamp-3">"{agent.status}"</p>
                            </div>

                            <div className="p-5 border-t border-white/5">
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-300 focus:border-kache-pink outline-none transition-all resize-none"
                                    placeholder="Transmit order..."
                                    rows={2}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendDirective(agent.name, e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}