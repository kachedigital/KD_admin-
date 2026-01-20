'use client';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface FinancialChartProps {
    data: {
        revenue: number;
        time: string;
    }[];
}

export default function FinancialChart({ data }: FinancialChartProps) {
    return (
        <div className="h-16 w-full mt-4 bg-black/20 rounded-lg p-2 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a161f', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                        itemStyle={{ color: '#0CC0DF' }}
                        cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#FF24E9"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                        className="drop-shadow-[0_0_8px_#FF24E9]"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
