'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface IntelligenceLog {
    id: string;
    created_at: string;
    agent_role: string;
    category: string;
    status: string;
    content: {
        project: string;
        message?: string;
        summary?: string;
        target?: string;
        description?: string;
    };
}

export default function ProjectPage() {
    const { slug } = useParams();
    const [logs, setLogs] = useState<IntelligenceLog[]>([]);
    const [projectInfo, setProjectInfo] = useState<{ name: string, description: string } | null>(null);
    const projectName = slug ? decodeURIComponent(slug.toString()) : '';

    useEffect(() => {
        if (!projectName) return;

        const fetchProjectData = async () => {
            // 1. Fetch Timeline Logs using JSONB filtering
            const { data } = await supabase
                .from('project_intelligence')
                .select('*')
                .contains('content', { project: projectName })
                .order('created_at', { ascending: false });

            if (data) {
                const projectLogs = data as IntelligenceLog[];
                setLogs(projectLogs);

                // 2. Try to find the initialization log for project mission briefing
                const initLog = projectLogs.find(log => log.category === 'Project Initialization');
                if (initLog) {
                    setProjectInfo({
                        name: projectName,
                        description: initLog.content.description || 'Mission parameters defined by Founder.'
                    });
                }
            }
        };

        fetchProjectData();

        // 3. Real-time listener for this specific project
        const channel = supabase.channel(`project:${projectName}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_intelligence' },
                (payload) => {
                    const newLog = payload.new as IntelligenceLog;
                    if (newLog.content?.project === projectName) {
                        setLogs(prev => [newLog, ...prev]);
                    }
                })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [projectName]);

    return (
        <>
            <Sidebar />
            <main
                className="flex-1 flex flex-col h-screen overflow-hidden transition-[padding] duration-300"
                style={{ paddingLeft: 'var(--sidebar-width)' }}
            >
                <Header title={`PROJECT: ${projectName.toUpperCase()}`} />

                <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
                    {/* 1. TOP SECTION: Project Mission Briefing */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-cyber-app p-8 rounded-2xl bg-[#1a161f]/80 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h1 className="font-monument text-3xl text-kache-cyan mb-2 uppercase tracking-tight">{projectName}</h1>
                            <p className="text-gray-400 text-sm italic mb-6">Status: Operational | Authority: Founder</p>
                            <div className="max-w-3xl">
                                <p className="text-gray-300 text-sm leading-relaxed font-mono">
                                    {projectInfo?.description || 'Establishing secure link to project parameters...'}
                                </p>
                            </div>
                        </div>
                        {/* Background Branding Overlay */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <img src="/logo_circle_logo.png" className="w-32" alt="" />
                        </div>
                    </motion.div>

                    {/* 2. MIDDLE SECTION: Intelligence Timeline */}
                    <div className="max-w-5xl">
                        <h3 className="font-monument text-xs uppercase tracking-[0.3em] text-gray-500 mb-10 pl-2">
                            Strategic Timeline logs
                        </h3>

                        <div className="space-y-6">
                            {logs.length > 0 ? logs.map((log) => (
                                <div key={log.id} className="relative pl-8 border-l border-white/10 group">
                                    {/* The Timeline Dot */}
                                    <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-kache-cyan group-hover:scale-150 transition-transform shadow-[0_0_8px_#0CC0DF]" />

                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="kache-card-glow p-5 rounded-xl bg-[#1a161f]/60 border border-white/5 transition-all hover:bg-[#1a161f]/80"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-[10px] font-monument uppercase tracking-tighter px-2 py-0.5 rounded",
                                                    log.agent_role === 'Founder' ? "bg-kache-pink/20 text-kache-pink" : "bg-kache-cyan/20 text-kache-cyan"
                                                )}>
                                                    {log.agent_role}
                                                </span>
                                                {log.category && (
                                                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest bg-white/5 px-2 py-0.5 rounded">
                                                        {log.category}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[9px] text-gray-500 font-mono">
                                                {new Date(log.created_at).toLocaleString()}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-200 leading-relaxed font-mono">
                                            {log.content.message || log.content.summary}
                                        </p>

                                        {log.content.target && log.agent_role === 'Founder' && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Target:</span>
                                                <span className="text-[9px] text-kache-cyan font-bold uppercase tracking-widest px-2 py-0.5 bg-kache-cyan/5 rounded">
                                                    {log.content.target}
                                                </span>
                                            </div>
                                        )}

                                        {log.status === 'blocked' && (
                                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-bold uppercase flex items-center gap-2">
                                                <span className="animate-pulse">⚠️</span> Agent Reporting Blocker
                                            </div>
                                        )}

                                        {log.status === 'completed' && (
                                            <div className="mt-4 flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-green-500" />
                                                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Mission Phase Complete</span>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                    <div className="h-8 w-8 rounded-full border border-dashed border-gray-500 animate-spin mb-4" />
                                    <p className="text-xs font-monument uppercase tracking-widest">Establishing secure link...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
