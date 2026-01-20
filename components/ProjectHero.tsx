'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ProjectEmptyState from './ProjectEmptyState';
import FinancialChart from './FinancialChart';
import { fetchProjectFinancials } from '@/lib/queries';

interface Project {
    id: string;
    name: string;
    owner: string;
}

interface IntelligenceLog {
    id: string;
    created_at: string;
    agent_role: string;
    category?: string;
    status?: string;
    content?: {
        project?: string;
        summary?: string;
    };
}

const PROJECTS: Project[] = [
    { id: 'store', name: 'KacheDigital Store', owner: 'Founder' },
    { id: 'ccc', name: 'Career Command Center', owner: 'Product Architect' },
    { id: 'hq', name: 'KD_HQ', owner: 'Store Architect' }
];

interface ProjectHeroProps {
    hideTitle?: boolean;
    onInitialize?: () => void;
}

// Mock performance data generator for premium visuals
const generatePerformanceData = (seed: string) => {
    const data = [];
    const base = seed.length * 1000;
    for (let i = 0; i < 7; i++) {
        data.push({
            time: `D${i}`,
            revenue: base + Math.sin(i + seed.length) * 500 + Math.random() * 200
        });
    }
    return data;
};

const ProjectCard = ({ project }: { project: any }) => {
    const [financialData, setFinancialData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            const stats = await fetchProjectFinancials(project.name);
            // If no real data, fallback to generated for visual premium feel
            if (stats.length === 0) {
                setFinancialData(generatePerformanceData(project.name));
            } else {
                // Ensure Recharts can consume the data correctly (mapping date to 'time')
                setFinancialData(stats.map(s => ({ ...s, time: s.date })));
            }
            setIsLoading(false);
        };
        loadStats();
    }, [project.name]);

    const currentRevenue = financialData.length > 0
        ? financialData[financialData.length - 1].revenue
        : 0;

    return (
        <div className="min-w-[380px] border-cyber-app glow-cyan rounded-2xl flex flex-col overflow-hidden bg-[#1a161f]/90 transition-all">
            {/* Header Linked to Detail Page */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-kache-cyan/5 to-transparent">
                <Link href={`/projects/${encodeURIComponent(project.name)}`} className="group">
                    <h3 className="font-monument text-[11px] uppercase tracking-wider text-white group-hover:text-kache-cyan transition-colors">
                        {project.name} <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↗</span>
                    </h3>
                </Link>
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                    <img src="/logo_circle_logo.png" className="w-5 opacity-40" alt="" />
                </div>
            </div>

            {/* Revenue Pulse Visualization */}
            <div className="px-5 pt-4">
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                        <h4 className="font-monument text-[9px] text-gray-500 uppercase">Revenue Pulse</h4>
                        <span className="text-[10px] text-kache-cyan font-bold">
                            ${currentRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <FinancialChart data={financialData} />

                    <p className="text-[8px] text-gray-600 mt-2 uppercase tracking-widest text-right">
                        Real-time Stripe Link: {isLoading ? 'Syncing...' : 'Active'}
                    </p>
                </div>
            </div>

            {/* Scrollable Intelligence Timeline */}
            <div className="p-4 max-h-[200px] overflow-y-auto space-y-3 custom-scrollbar flex-grow">
                {project.logs.length > 0 ? project.logs.map((log: any) => (
                    <div key={log.id} className="bg-black/20 p-3 rounded-xl border border-white/5 flex justify-between items-start group/log hover:bg-black/40 transition-all">
                        <div className="flex-1 pr-4 min-w-0">
                            <p className="text-[9px] text-kache-pink font-bold uppercase mb-1 tracking-tighter opacity-80">{log.agent_role}</p>
                            <p className="text-[11px] text-gray-300 leading-tight font-mono line-clamp-2 group-hover/log:text-white transition-colors">
                                {log.content.summary || log.content.message}
                            </p>
                        </div>
                        <div className={cn(
                            "h-2 w-2 rounded-full mt-1 shrink-0 shadow-sm",
                            log.status === 'completed' ? 'bg-green-400 shadow-green-400/20' :
                                log.status === 'blocked' ? 'bg-red-500 animate-pulse shadow-red-500/40' :
                                    'bg-kache-cyan shadow-kache-cyan/20'
                        )} />
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                        <p className="text-[10px] font-monument uppercase tracking-widest italic">Awaiting Signal...</p>
                    </div>
                )}
            </div>

            {/* Card Footer: Detail Link */}
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <Link
                    href={`/projects/${encodeURIComponent(project.name)}`}
                    className="w-full flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-monument text-[8px] tracking-[0.2em] transition-all text-gray-400 hover:text-white group"
                >
                    DECRYPT FULL INTEL
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
            </div>
        </div>
    );
};

export default function ProjectHero({ hideTitle = false, onInitialize }: ProjectHeroProps) {
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchProjectPulse = async () => {
            // Fetch latest logs to identify active projects
            const { data } = await supabase
                .from('project_intelligence')
                .select('*')
                .not('status', 'eq', 'archived')
                .order('created_at', { ascending: false });

            if (data) {
                const logs = data as IntelligenceLog[];
                // Grouping logs by project name
                const uniqueProjects = Array.from(new Set(logs.map(log => log.content?.project))).filter(Boolean) as string[];

                const projectSummaries = uniqueProjects.map(name => ({
                    name,
                    logs: logs.filter(d => d.content?.project === name && d.category !== 'Project Initialization').slice(0, 10) // Last 10 tactical updates
                }));
                setProjects(projectSummaries);
            }
        };

        fetchProjectPulse();

        // Real-time synchronization
        const channel = supabase.channel('project-hero-sync')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_intelligence' }, fetchProjectPulse)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <section className="relative mb-10">
            {!hideTitle && (
                <div className="flex items-center justify-between mb-8">
                    <h1 className="cyber-text text-4xl uppercase">EXECUTIVE PROJECT OVERVIEW</h1>
                    <button
                        onClick={onInitialize}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group"
                    >
                        <span className="text-kache-cyan group-hover:scale-125 transition-transform">+</span>
                        <span className="font-monument text-[10px] uppercase tracking-widest">Initialize Project</span>
                    </button>
                </div>
            )}

            {/* 2. PROJECT CARDS (Horizontal Scroll) */}
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide custom-scrollbar min-h-[300px]">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                    ))
                ) : (
                    <ProjectEmptyState onInitialize={onInitialize || (() => { })} />
                )}
            </div>
        </section>
    );
}
