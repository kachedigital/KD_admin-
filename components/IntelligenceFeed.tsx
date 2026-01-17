"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Terminal, Bell, Activity } from "lucide-react"

interface IntelligenceLog {
    id: string
    created_at: string
    log_message: string
    agent_role: string
}

export function IntelligenceFeed() {
    const [logs, setLogs] = useState<IntelligenceLog[]>([])

    useEffect(() => {
        // Initial fetch
        const fetchLogs = async () => {
            const { data, error } = await supabase
                .from('project_intelligence')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20)

            if (error) {
                console.error('Error fetching logs:', error)
            } else {
                setLogs(data || [])
            }
        }

        fetchLogs()

        // Real-time subscription
        const channel = supabase
            .channel('project_intelligence_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'project_intelligence',
                },
                (payload) => {
                    setLogs((prev) => [payload.new as IntelligenceLog, ...prev].slice(0, 20))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="w-80 h-full border-r border-white/10 bg-[#290747]/50 backdrop-blur-md flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-montserrat font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    Intelligence Feed
                </h3>
                <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">
                    REAL-TIME
                </Badge>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {logs.length === 0 && (
                        <div className="text-white/30 text-xs italic text-center py-10">
                            Awaiting signal...
                        </div>
                    )}
                    {logs.map((log) => (
                        <div key={log.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${log.agent_role === 'Founder' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                                    }`}>
                                    {log.agent_role?.toUpperCase()}
                                </span>
                                <span className="text-[9px] text-white/30">
                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-poppins">
                                {log.log_message}
                            </p>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-3 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <Terminal className="w-3 h-3" />
                    <span>SYSTEM_STATUS: ACTIVE</span>
                </div>
            </div>
        </div>
    )
}
