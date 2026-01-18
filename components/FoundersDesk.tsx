"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Send, Zap } from "lucide-react"
import { toast } from "sonner"

export function FoundersDesk() {
    const [intent, setIntent] = useState("")
    const [isSending, setIsSending] = useState(false)

    const handleSendIntent = async () => {
        if (!intent.trim()) return

        setIsSending(true)
        try {
            const { error } = await supabase
                .from('project_intelligence')
                .insert([
                    {
                        log_message: intent,
                        agent_role: 'Founder',
                        metadata: { type: 'Executive Intent', timestamp: new Date().toISOString() }
                    }
                ])

            if (error) throw error

            toast.success("Executive Intent Broadcasted")
            setIntent("")
        } catch (error: any) {
            console.error('Error sending intent:', error)
            toast.error("Failed to broadcast intent")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Card gradient="magenta">
            <CardHeader className="pb-3 pt-5">
                <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2 text-white">
                    <Zap className="w-4 h-4 text-[#FF24E9] animate-pulse" />
                    FOUNDER'S DESK
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Textarea
                        placeholder="Enter Executive Intent..."
                        className="bg-black/30 border-white/10 text-white placeholder:text-white/30 min-h-[100px] text-sm focus:border-[#0CC0DF]/50 transition-colors rounded-lg"
                        value={intent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIntent(e.target.value)}
                    />
                    <Button
                        onClick={handleSendIntent}
                        disabled={isSending || !intent.trim()}
                        className="w-full bg-white hover:bg-white/90 text-black font-semibold rounded-full"
                    >
                        {isSending ? "SYNCING..." : "BROADCAST INTENT"}
                        <Send className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
