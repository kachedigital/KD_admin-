"use client"

import React from "react"
import { Bell, Cloud, Menu, MessageSquare, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeaderProps {
    title?: string;
}

export default function Header({ title = "KACHE DIGITAL CORE" }: HeaderProps) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-6 backdrop-blur shrink-0">
            <div className="flex flex-1 items-center justify-between">
                <h1 className="text-xl font-bold font-montserrat tracking-tighter chromatic-aberration uppercase">
                    {title}
                </h1>

                <div className="flex items-center gap-4">
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
        </header>
    )
}
