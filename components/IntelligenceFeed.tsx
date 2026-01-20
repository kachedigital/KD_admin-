"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Terminal, Bell, Activity } from "lucide-react"

interface IntelligenceLog {
    id: string
    created_at: string
    log_message?: string
    category?: string
    content: {
        summary?: string
        target?: string
        message?: string
        path?: string
        ip?: string
    }
    agent_role: string
}

export default function IntelligenceFeed() {
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
        <div className="w-80 h-full border-l border-white/[0.08] bg-[#1E1E1F] flex flex-col">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="font-semibold text-sm tracking-wide uppercase flex items-center gap-2 text-white">
                    <Activity className="w-4 h-4 text-[#0CC0DF]" />
                    Intelligence Feed
                </h3>
                <Badge variant="outline" className="text-[10px] border-[#0CC0DF]/30 text-[#0CC0DF] rounded-full">
                    REAL-TIME
                </Badge>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {logs.length === 0 && (
                        <div className="text-white/40 text-xs italic text-center py-10">
                            Awaiting signal...
                        </div>
                    )}
                    {logs.map((log) => (
                        <div key={log.id} className="space-y-2">
                            {log.category === 'Security Alert' && (
                                <div className="border-l-2 border-kache-coral bg-kache-coral/10 p-4 rounded-lg animate-pulse mb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm">⚠️</span>
                                        <h4 className="font-monument text-[9px] text-kache-coral uppercase">Security Breach Detected</h4>
                                    </div>
                                    <p className="text-[10px] text-gray-300">
                                        Warden blocked access to <span className="text-white">{log.content.path}</span> from {log.content.ip}
                                    </p>
                                </div>
                            )}

                            {/* 2. Standard Intelligence Entry (Hide if Security Alert just showed to avoid duplication unless intended) */}
                            {log.category !== 'Security Alert' && (
                                <div className="p-3 bg-black/30 rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-colors group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${log.agent_role === 'Founder' ? 'bg-[#FF24E9]/20 text-[#FF24E9]' : 'bg-[#0CC0DF]/20 text-[#0CC0DF]'
                                            }`}>
                                            {log.agent_role?.toUpperCase() || 'SYSTEM'}
                                        </span>
                                        <span className="text-[9px] text-white/40">
                                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed font-mono">
                                        {log.log_message ||
                                            log.content?.summary ||
                                            (log.content?.target ? `Order to ${log.content.target}: ${log.content.message}` : null) ||
                                            'No content transmitted.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-3 border-t border-white/[0.08] bg-black/20">
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <Terminal className="w-3 h-3" />
                    <span>SYSTEM_STATUS: ACTIVE</span>
                </div>
            </div>
        </div>
    )
}
