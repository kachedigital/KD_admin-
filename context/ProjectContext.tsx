"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { updateLiquidTone } from '@/hooks/useLiquidTone';

interface Message {
    id: string;
    task_id: string;
    sender: string;
    content: string;
    created_at: string;
}

interface KanbanTask {
    id: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
}

interface ProjectContextType {
    tasks: KanbanTask[];
    messages: Message[];
    addMessage: (taskId: string, content: string, sender?: string) => Promise<void>;
    updateTaskStatus: (taskId: string, status: KanbanTask['status']) => Promise<void>;
    toneValue: number;
    setToneValue: (v: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [toneValue, setToneValue] = useState(50); // Biological signature slider (0-100)

    useEffect(() => {
        if (typeof document !== 'undefined') {
            updateLiquidTone(toneValue);
            // Higher tone = more intense/faster pulse. 3s down to 1s.
            const pulseDuration = `${3 - (toneValue / 100) * 2}s`;
            document.documentElement.style.setProperty('--pulse-duration', pulseDuration);
        }
    }, [toneValue]);

    useEffect(() => {
        // Fetch initial tasks and messages
        const fetchBoardData = async () => {
            const { data: taskData } = await supabase.from('kanban_tasks').select('*');
            const { data: messageData } = await supabase.from('task_messages').select('*').order('created_at', { ascending: true });

            if (taskData) setTasks(taskData as KanbanTask[]);
            if (messageData) setMessages(messageData as Message[]);
        };

        fetchBoardData();

        // Subscribe to real-time changes
        const tasksChannel = supabase.channel('kanban_tasks_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'kanban_tasks' }, fetchBoardData)
            .subscribe();

        const messagesChannel = supabase.channel('task_messages_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'task_messages' }, fetchBoardData)
            .subscribe();

        return () => {
            supabase.removeChannel(tasksChannel);
            supabase.removeChannel(messagesChannel);
        };
    }, []);

    const addMessage = async (taskId: string, content: string, sender: string = 'Founder') => {
        await supabase.from('task_messages').insert([{
            task_id: taskId,
            sender,
            content
        }]);
    };

    const updateTaskStatus = async (taskId: string, status: KanbanTask['status']) => {
        await supabase.from('kanban_tasks').update({ status }).eq('id', taskId);
    };

    return (
        <ProjectContext.Provider value={{ tasks, messages, addMessage, updateTaskStatus, toneValue, setToneValue }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}
