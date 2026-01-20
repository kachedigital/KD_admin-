'use client';

interface ProjectEmptyStateProps {
    onInitialize: () => void;
}

export default function ProjectEmptyState({ onInitialize }: ProjectEmptyStateProps) {
    return (
        <div className="w-full h-[280px] border-cyber-app rounded-2xl bg-[#1a161f]/40 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Moving Scanner Beam */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kache-cyan/10 to-transparent h-1/2 w-full animate-scan pointer-events-none" />

            <div className="relative z-10 text-center px-6">
                <div className="w-16 h-16 rounded-full border border-kache-cyan/20 flex items-center justify-center mx-auto mb-6 bg-kache-cyan/5 animate-pulse">
                    <span className="text-2xl text-kache-cyan">📡</span>
                </div>

                <h3 className="font-monument text-[10px] uppercase tracking-[0.3em] text-white mb-2">
                    Waiting for Neural Link
                </h3>
                <p className="text-[11px] text-gray-500 max-w-[280px] mx-auto leading-relaxed mb-6">
                    No active project data detected in the Shared Brain. Initialize a project to begin tactical monitoring.
                </p>

                <button
                    onClick={onInitialize}
                    className="py-3 px-8 border border-kache-cyan/40 rounded-xl font-monument text-[9px] text-kache-cyan hover:bg-kache-cyan hover:text-black transition-all uppercase tracking-widest bg-kache-cyan/5"
                >
                    FORCE INITIALIZATION
                </button>
            </div>

            {/* Background Grid Pattern for texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #0CC0DF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
    );
}
