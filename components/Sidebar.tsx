"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
    Home,
    Grid,
    FileText,
    Layers,
    BookOpen,
    Users,
    Bookmark,
    ChevronDown,
    Settings,
    Search,
    X
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const sidebarItems = [
    {
        title: "Home",
        icon: <Home />,
        isActive: true,
        url: "/"
    },
    {
        title: "Apps",
        icon: <Grid />,
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
        icon: <FileText />,
        items: [
            { title: "Recent", url: "#" },
            { title: "Shared with me", url: "#", badge: "3" },
            { title: "Favorites", url: "#" },
            { title: "Trash", url: "#" },
        ],
    },
    {
        title: "Learn",
        icon: <BookOpen />,
        items: [
            { title: "Tutorials", url: "#" },
            { title: "Courses", url: "#" },
            { title: "Webinars", url: "#" },
            { title: "Resources", url: "#" },
        ],
    },
    {
        title: "Community",
        icon: <Users />,
        items: [
            { title: "Explore", url: "#" },
            { title: "Following", url: "#" },
            { title: "Challenges", url: "#" },
            { title: "Events", url: "#" },
        ],
    },
    {
        title: "Resources",
        icon: <Bookmark />,
        items: [
            { title: "Stock Photos", url: "#" },
            { title: "Fonts", url: "#" },
            { title: "Icons", url: "#" },
            { title: "Templates", url: "#" },
        ],
    },
]

export default function Sidebar() {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ "Projects": true })
    const [isOpen, setIsOpen] = useState(true)
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

    return (
        <aside className={cn(
            "h-screen border-r bg-background transition-all duration-300 ease-in-out z-30 sticky top-0 left-0",
            isOpen ? "w-64" : "w-0 overflow-hidden md:w-20"
        )}>
            <div className="flex h-full flex-col">
                <div className="p-4 flex items-center gap-3">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-2xl overflow-hidden shrink-0">
                        <img src="/KD_brandkit/KD_logo.png" className="w-full h-full object-contain" alt="Kache Digital Logo" />
                    </div>
                    <div className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 md:hidden")}>
                        <h2 className="font-montserrat font-bold tracking-tighter chromatic-aberration text-sm whitespace-nowrap uppercase">Kache Digital</h2>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Cyber-Fusion Suite</p>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2 text-xs" />
                    </div>
                </div>

                <ScrollArea className="flex-1 px-3 py-2">
                    <div className="space-y-1">
                        {/* Static Items */}
                        {sidebarItems.map((item) => (
                            <div key={item.title} className="mb-1">
                                <Link
                                    href={item.url || "#"}
                                    onClick={(e) => {
                                        if (item.items) {
                                            e.preventDefault();
                                            toggleExpanded(item.title);
                                        }
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                                        item.isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="shrink-0">{item.icon}</span>
                                        <span className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 md:hidden")}>{item.title}</span>
                                    </div>
                                    {isOpen && item.badge && (
                                        <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-[10px]">
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
                                    <div className="mt-1 ml-6 space-y-1 border-l pl-3 border-white/5">
                                        {item.items.map((subItem) => (
                                            <a
                                                key={subItem.title}
                                                href={subItem.url}
                                                className="flex items-center justify-between rounded-2xl px-3 py-2 text-xs hover:bg-muted"
                                            >
                                                {subItem.title}
                                                {subItem.badge && (
                                                    <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-[9px]">
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
                        <div className="mb-1 mt-4">
                            <button
                                onClick={() => toggleExpanded("Projects")}
                                className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                            >
                                <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                                    <Layers className="h-5 w-5 shrink-0" />
                                    <span className={cn("font-monument text-[10px] uppercase tracking-widest transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 md:hidden")}>
                                        Projects
                                    </span>
                                </div>
                                {isOpen && (
                                    <ChevronDown
                                        className={cn(
                                            "ml-2 h-4 w-4 transition-transform",
                                            expandedItems["Projects"] ? "rotate-180" : "",
                                        )}
                                    />
                                )}
                            </button>

                            {isOpen && expandedItems["Projects"] && (
                                <div className="mt-2 ml-6 space-y-1 border-l border-white/5 pl-4">
                                    {activeProjects.map((proj) => (
                                        <Link
                                            key={proj.name}
                                            href={`/projects/${encodeURIComponent(proj.name)}`}
                                            className="block py-2 text-[10px] text-gray-500 hover:text-kache-cyan transition-colors uppercase font-bold tracking-tighter"
                                        >
                                            {proj.name}
                                        </Link>
                                    ))}
                                    {activeProjects.length === 0 && (
                                        <span className="block py-2 text-[9px] text-gray-600 italic">No Active Missions</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                <div className="border-t border-white/5 p-3">
                    <div className="space-y-1">
                        <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                            <Settings className="h-5 w-5 shrink-0" />
                            <span className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 md:hidden")}>Settings</span>
                        </button>
                        <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback className="text-[10px]">KD</AvatarFallback>
                                </Avatar>
                                <span className={cn("transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 md:hidden text-xs")}>Founder</span>
                            </div>
                            {isOpen && <Badge variant="outline" className="ml-auto text-[10px] border-primary/30 text-primary">Founder</Badge>}
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
