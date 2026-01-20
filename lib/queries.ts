import { supabase } from './supabase';

export const fetchProjectFinancials = async (projectName: string) => {
    const { data, error } = await supabase
        .from('project_intelligence')
        .select('created_at, content')
        .eq('category', 'Financial Log')
        .contains('content', { project: projectName })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching financial data:', error);
        return [];
    }

    // Transform raw logs into { date: string, revenue: number }
    const chartData = data.reduce((acc: any[], log: any) => {
        const date = new Date(log.created_at).toLocaleDateString();
        const amount = parseFloat(log.content.amount || 0);

        const existingDate = acc.find(d => d.date === date);
        if (existingDate) {
            existingDate.revenue += amount;
        } else {
            acc.push({ date, revenue: amount });
        }
        return acc;
    }, []);

    return chartData;
};
