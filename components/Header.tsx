"use client"

import React, { useState } from "react"
import { Bell, Cloud, Menu, MessageSquare, PanelLeft, Lock, Unlock, Zap, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLayout } from "./LayoutWrapper"

interface HeaderProps {
    title?: string;
}

export default function Header({ title = "KACHE DIGITAL CORE" }: HeaderProps) {
    const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
    const { isFocusMode, toggleFocus } = useLayout();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-800 bg-[#0a0510]/95 px-6 backdrop-blur shrink-0 transition-colors duration-300">
            <div className="flex flex-1 items-center justify-between">
                <h1 className="text-xl font-bold font-montserrat tracking-tighter text-white uppercase">
                    {title}
                </h1>

                <div className="flex items-center gap-4">
                    <TooltipProvider>
                        <div className="flex items-center gap-3 mr-2">
                            {/* Vault Status Toggle */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsVaultUnlocked(!isVaultUnlocked)}
                                        className={`h-8 gap-2 border-zinc-800 transition-colors ${isVaultUnlocked
                                            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400'
                                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                            }`}
                                    >
                                        {isVaultUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                        <span className="hidden sm:inline text-xs font-semibold">
                                            {isVaultUnlocked ? 'Vault Open' : 'Vault Locked'}
                                        </span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                    Toggle Vault Status
                                </TooltipContent>
                            </Tooltip>

                            {/* Vibe Toggle */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleFocus()}
                                        className={`h-8 gap-2 border-zinc-800 transition-colors ${isFocusMode
                                            ? 'bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 hover:text-violet-400'
                                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                            }`}
                                    >
                                        {isFocusMode ? <Zap className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                        <span className="hidden sm:inline text-xs font-semibold">
                                            {isFocusMode ? 'Focus Vibe' : 'Standard Vibe'}
                                        </span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                    Toggle Interface Vibe
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-zinc-800 mx-1" />

                    <div className="flex flex-row items-center gap-2">
                        <TooltipProvider>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white/5">
                                            <Cloud className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Cloud Storage</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white/5">
                                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Messages</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white/5 relative">
                                            <Bell className="h-5 w-5 text-muted-foreground" />
                                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-kache-pink animate-pulse" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Notifications</TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>

                        <div className="h-8 w-px bg-white/10 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-white leading-none">Founder HQ</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Status: Online</p>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-primary">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Founder" />
                                <AvatarFallback>KD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
