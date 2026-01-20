"use client"

import React from "react"
import { motion } from "framer-motion"
import { ImageIcon, Brush, Video, Sparkles, Layers, LayoutGrid, Camera, Code, CuboidIcon, Type, Palette, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const apps = [
    {
        name: "PixelMaster Pro",
        icon: <ImageIcon className="text-violet-500" />,
        description: "Advanced image editing and composition",
        category: "Creative",
        recent: true,
        new: false,
        progress: 100,
        price: "$49.99/mo",
        features: ["AI Integration", "4K Export", "Asset Library"],
        fileType: ".PXDL"
    },
    {
        name: "VectorPro Elite",
        icon: <Brush className="text-orange-500" />,
        description: "Professional vector graphics creation",
        category: "Creative",
        recent: true,
        new: false,
        progress: 100,
        price: "$39.99/mo",
        features: ["Bezier Precision", "Variable Fonts", "Color Mesh"],
        fileType: ".VGX"
    },
    {
        name: "VideoStudio X",
        icon: <Video className="text-pink-500" />,
        description: "Cinematic video editing and production",
        category: "Video",
        recent: true,
        new: false,
        progress: 100,
        price: "$59.99/mo",
        features: ["8K Timeline", "Motion Blur", "Dolby Vision"],
        fileType: ".KVID"
    }
]

export default function RecentApps() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold font-montserrat tracking-tight uppercase">Dashboard Apps</h2>
                <Button variant="ghost" size="sm" className="rounded-2xl text-xs text-muted-foreground hover:text-white">
                    View All
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                    <motion.div key={app.name} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                        <Card gradient="cyan" className="hover:border-[#0CC0DF]/30 transition-all duration-300">
                            <CardHeader className="pb-2 pt-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/[0.08]">
                                        {app.icon}
                                    </div>
                                    <Badge variant="outline" className="rounded-full border-[#0CC0DF]/30 text-[#0CC0DF] font-mono text-[10px]">
                                        {app.fileType}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="flex items-center justify-between mb-1">
                                    <CardTitle className="text-sm font-semibold truncate text-white uppercase tracking-tighter">{app.name}</CardTitle>
                                </div>
                                <CardDescription className="line-clamp-2 text-[10px] mb-3 text-white/60">{app.description}</CardDescription>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {app.features?.map((f: string) => (
                                        <span key={f} className="text-[8px] px-2 py-0.5 bg-black/30 rounded-full border border-white/[0.05] text-white/50 uppercase font-bold">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full rounded-full bg-white hover:bg-white/90 text-black font-bold text-[10px] py-1 h-8">
                                    INITIALIZE
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
