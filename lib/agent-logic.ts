import { supabase } from '@/lib/supabase';

/**
 * Simulates a response from an AI agent when a Founder directive is received.
 * In a production environment, this could be substituted with a real AI processing pipeline.
 */
export const triggerAgentResponse = async (targetAgent: string, project: string, message: string) => {
    // 1. Simulate "Thinking" time for cognitive realism
    setTimeout(async () => {

        // 2. Write the Acknowledgment back to the Shared Brain
        const { error } = await supabase.from('project_intelligence').insert([{
            agent_role: targetAgent,
            category: 'Task Update',
            content: {
                project: project,
                summary: `Received directive: "${message.substring(0, 25)}...". Analysis initialized.`,
                details: `Standing by for execution phase. Neural link stable. Decoding strategic intent for ${project}.`
            },
            status: 'working'
        }]);

        if (error) {
            console.error("Agent Echo Failed:", error.message);
        } else {
            console.log(`Agent ${targetAgent} successfully acknowledged directive for ${project}`);
        }
    }, 3500); // 3.5 second delay for enhanced realism
};
