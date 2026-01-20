"use client"

import React from "react"
import { motion } from "framer-motion"
import { ImageIcon, Brush, Video, Sparkles, Layers, LayoutGrid, Camera, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentFiles = [
    {
        name: "Brand Redesign.pxm",
        app: "PixelMaster",
        modified: "2 hours ago",
        icon: <ImageIcon className="text-violet-500" />,
        shared: true,
        size: "24.5 MB",
        collaborators: 3,
    },
    {
        name: "Company Logo.vec",
        app: "VectorPro",
        modified: "Yesterday",
        icon: <Brush className="text-orange-500" />,
        shared: true,
        size: "8.2 MB",
        collaborators: 2,
    },
    {
        name: "Product Launch Video.vid",
        app: "VideoStudio",
        modified: "3 days ago",
        icon: <Video className="text-pink-500" />,
        shared: false,
        size: "1.2 GB",
        collaborators: 0,
    },
    {
        name: "UI Animation.mfx",
        app: "MotionFX",
        modified: "Last week",
        icon: <Sparkles className="text-blue-500" />,
        shared: true,
        size: "345 MB",
        collaborators: 4,
    }
]

export default function RecentFiles() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold font-montserrat tracking-tight uppercase">Recent Intel Assets</h2>
                <Button variant="ghost" size="sm" className="rounded-2xl text-xs text-muted-foreground hover:text-white">
                    View All
                </Button>
            </div>
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="grid grid-cols-1 divide-y divide-white/[0.05]">
                    {recentFiles.map((file) => (
                        <motion.div
                            key={file.name}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                            className="flex items-center justify-between p-4 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 border border-white/[0.08]">
                                    {file.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-xs uppercase tracking-tight">{file.name}</p>
                                    <p className="text-[10px] text-white/40 font-medium">
                                        {file.app} • {file.modified}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {file.shared && (
                                    <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-[9px] text-white/50">
                                        <Users className="mr-1 h-3 w-3" />
                                        {file.collaborators}
                                    </Badge>
                                )}
                                <Button variant="ghost" size="sm" className="rounded-full text-[10px] h-8 px-4 font-bold text-kache-cyan hover:bg-kache-cyan/10">
                                    DECRYPT
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </section>
    )
}
