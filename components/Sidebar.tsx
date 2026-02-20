"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLayout } from './LayoutWrapper'
import { VAULT_SPRING } from '@/lib/motion-constants'
import {
    Grid,
    FileText,
    Layers,
    BookOpen,
    Users,
    Bookmark,
    ChevronDown,
    Settings,
    Search,
    X,
    Command,
    Sparkles,
    Lock,
    ShieldAlert,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StatusDot } from "@/components/ui/StatusDot"

const sidebarItems = [
    { title: "Command Center", icon: <Command size={20} />, isActive: true, url: "/", isHighUtility: true },
    { title: "Reslivin Agent", icon: <Sparkles size={20} />, url: "/agent", isHighUtility: true },
    { title: "Vault", icon: <Lock size={20} />, url: "/vault", isHighUtility: true },
    { title: "Panic Wipe", icon: <ShieldAlert size={20} />, url: "/panic", isHighUtility: true, color: "text-red-500" },
    {
        title: "Apps",
        icon: <Grid size={20} />,
        badge: "2",
        items: [
            { title: "All Apps", url: "#" },
            { title: "Recent", url: "#" },
            { title: "Updates", url: "#", badge: "2" },
            { title: "Installed", url: "#" },
        ],
    },
    {
        title: "Files",
        icon: <FileText size={20} />,
        items: [
            { title: "Recent", url: "#" },
            { title: "Shared with me", url: "#", badge: "3" },
            { title: "Favorites", url: "#" },
            { title: "Trash", url: "#" },
        ],
    }
]

export default function Sidebar() {
    const { isSidebarOpen: isOpen, setIsSidebarOpen: setIsOpen } = useLayout();
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ "Projects": true })
    const [activeProjects, setActiveProjects] = useState<{ name: string }[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from('project_intelligence')
                .select('content');

            if (data) {
                const uniqueNames = Array.from(new Set(data.map(d => d.content?.project))).filter(Boolean) as string[];
                setActiveProjects(uniqueNames.map(name => ({ name })));
            }
        };

        fetchProjects();
        const channel = supabase.channel('sidebar_project_sync')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_intelligence' }, fetchProjects)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const toggleExpanded = (title: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    const visibleItems = isOpen ? sidebarItems : sidebarItems.filter(item => item.isHighUtility);

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 256 : 80 }}
            transition={VAULT_SPRING}
            className="fixed top-0 left-0 h-screen z-30 border-r border-zinc-800 bg-[#0a0510]/95 backdrop-blur overflow-hidden flex flex-col pt-16 sm:pt-0"
        >
            <div className="flex h-full flex-col">
                <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
                    <div className="flex items-center gap-3">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-2xl overflow-hidden shrink-0">
                            <img src="/KD_brandkit/KD_logo.png" className="w-full h-full object-contain" alt="Kache Digital Logo" />
                        </div>
                        <div className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 md:hidden w-0 overflow-hidden")}>
                            <h2 className="font-montserrat font-bold tracking-tighter chromatic-aberration text-sm whitespace-nowrap uppercase text-white">Kache Digital</h2>
                            <p className="text-[8px] text-emerald-500 uppercase tracking-widest font-bold">Sovereign Deck</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 text-zinc-400 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </Button>
                </div>

                {isOpen && (
                    <div className="px-3 py-4 animate-in fade-in duration-300">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-zinc-900 border-zinc-800 pl-9 pr-4 py-2 text-xs text-white" />
                        </div>
                    </div>
                )}

                <ScrollArea className="flex-1 px-3 py-4">
                    <div className="space-y-2">
                        {/* Items Mapping */}
                        {visibleItems.map((item) => (
                            <div key={item.title} className="mb-1">
                                <Link
                                    href={item.url || "#"}
                                    onClick={(e) => {
                                        if (item.items) {
                                            if (!isOpen) setIsOpen(true);
                                            e.preventDefault();
                                            toggleExpanded(item.title);
                                        }
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors group",
                                        item.isActive ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white",
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={cn("shrink-0 relative", item.color || "")}>
                                            {item.icon}
                                            {item.title === "Reslivin Agent" && (
                                                <span className="absolute -top-1 -right-1">
                                                    <StatusDot glowColor="var(--glow-color, #0CC0DF)" />
                                                </span>
                                            )}
                                        </span>
                                        <span className={cn("transition-all duration-300 whitespace-nowrap", isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden")}>{item.title}</span>
                                    </div>
                                    {isOpen && item.badge && (
                                        <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-[10px] border-zinc-700">
                                            {item.badge}
                                        </Badge>
                                    )}
                                    {isOpen && item.items && (
                                        <ChevronDown
                                            className={cn(
                                                "ml-2 h-4 w-4 transition-transform",
                                                expandedItems[item.title] ? "rotate-180" : "",
                                            )}
                                        />
                                    )}
                                </Link>

                                {isOpen && item.items && expandedItems[item.title] && (
                                    <div className="mt-1 ml-6 space-y-1 border-l border-zinc-800 pl-3">
                                        {item.items.map((subItem) => (
                                            <a
                                                key={subItem.title}
                                                href={subItem.url}
                                                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                            >
                                                {subItem.title}
                                                {subItem.badge && (
                                                    <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-[9px] border-zinc-700">
                                                        {subItem.badge}
                                                    </Badge>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Dynamic Projects Section */}
                        {isOpen && (
                            <div className="mb-1 mt-6 animate-in fade-in duration-300">
                                <button
                                    onClick={() => toggleExpanded("Projects")}
                                    className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-zinc-800/50 group"
                                >
                                    <div className="flex items-center gap-3 text-zinc-500 group-hover:text-emerald-500 transition-colors">
                                        <Layers className="h-4 w-4 shrink-0" />
                                        <span className="font-monument text-[9px] uppercase tracking-widest">
                                            Active Datasets
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "ml-2 h-3 w-3 text-zinc-500 transition-transform",
                                            expandedItems["Projects"] ? "rotate-180" : "",
                                        )}
                                    />
                                </button>

                                {expandedItems["Projects"] && (
                                    <div className="mt-2 ml-6 space-y-1 border-l border-zinc-800 pl-4">
                                        {activeProjects.map((proj) => (
                                            <Link
                                                key={proj.name}
                                                href={`/projects/${encodeURIComponent(proj.name)}`}
                                                className="block py-2 text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors uppercase font-bold tracking-tighter"
                                            >
                                                {proj.name}
                                            </Link>
                                        ))}
                                        {activeProjects.length === 0 && (
                                            <span className="block py-2 text-[9px] text-zinc-700 italic">No Active Missions</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="border-t border-zinc-800 pt-2 pb-4 px-3 flex flex-col gap-1 items-center">
                    <button className={cn("flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium hover:bg-zinc-800/50 text-zinc-400 hover:text-white", isOpen ? "justify-start gap-3" : "justify-center")}>
                        <Settings size={20} className="shrink-0" />
                        {isOpen && <span>Settings</span>}
                    </button>
                    <button className={cn("flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium hover:bg-zinc-800/50", isOpen ? "justify-between" : "justify-center")}>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-7 w-7 border border-emerald-500/30">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                <AvatarFallback className="text-[10px] bg-emerald-950 text-emerald-500">KD</AvatarFallback>
                            </Avatar>
                            {isOpen && <span className="text-xs text-white">Founder</span>}
                        </div>
                    </button>
                </div>
            </div>
        </motion.aside>
    )
}
