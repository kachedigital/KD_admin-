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
        <Card className="glass-card border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-montserrat tracking-tighter flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                    FOUNDER'S DESK
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Textarea
                        placeholder="Enter Executive Intent..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/20 min-h-[100px] font-poppins text-sm focus:border-primary/50 transition-colors"
                        value={intent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIntent(e.target.value)}
                    />
                    <Button
                        onClick={handleSendIntent}
                        disabled={isSending || !intent.trim()}
                        className="w-full bg-primary hover:bg-primary/80 text-white font-montserrat font-bold glow-action"
                    >
                        {isSending ? "SYNCING..." : "BROADCAST INTENT"}
                        <Send className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
