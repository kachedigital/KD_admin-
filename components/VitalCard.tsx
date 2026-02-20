import React from 'react';
import { motion } from 'framer-motion';

export default function VitalCard() {
    return (
        <div className="
      p-6 rounded-xl border-[0.5px] border-slate-800 bg-[#0A0A0A] 
      hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.05)]
      transition-all duration-700 ease-in-out
      relative overflow-hidden
    ">
            {/* The Heartbeat Pulse Overlay */}
            <div className="absolute inset-0 bg-green-500/5 animate-pulse duration-[3000ms]" />
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 4 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0, 0, 0.2, 1] // Logarithmic curve
                    }
                }}
            >
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">System Health</h3>
                <p className="text-2xl font-medium text-green-400">99.9%</p>
            </motion.div>
        </div>
    );
}
