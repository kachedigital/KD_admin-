'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProjectHero from '@/components/ProjectHero';
import ExecutiveDirective from '@/components/ExecutiveDirective';
import MissionBriefingHero from '@/components/MissionBriefingHero';
import IntelligenceFeed from '@/components/IntelligenceFeed';
import NewProjectModal from '@/components/NewProjectModal';
import MissionCard from '@/components/MissionCard';
import VitalCard from '@/components/VitalCard';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMissionFocused, setIsMissionFocused] = useState(false);

  return (
    <>
      {/* Dim Overlay for Mission Focus */}
      {isMissionFocused && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 pointer-events-none" />
      )}
      <Sidebar /> {/* Left Navigation (Fixed) */}

      <main
        className="flex-1 flex flex-col h-screen overflow-hidden transition-[padding] duration-300"
        style={{ paddingLeft: 'var(--sidebar-width)' }}
      >
        <Header title="KACHE DIGITAL HQ" /> {/* Top Breadcrumbs & Profile */}

        <div className="flex-1 overflow-y-auto p-10 space-y-16 custom-scrollbar">

          {/* Mission Focus Sequence */}
          <MissionCard isFocused={isMissionFocused} onFocusChange={setIsMissionFocused} />

          {/* 1. HERO: Project Summary Cards */}
          <ProjectHero onInitialize={() => setIsModalOpen(true)} />

          {/* 2. COMMAND: Founder's Desk */}
          <section className="flex justify-center">
            <div className="w-full max-w-5xl">
              <ExecutiveDirective />
            </div>
          </section>

          <section>
            <div className="flex items-start justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <h2 className="font-monument text-[10px] uppercase tracking-[0.3em] text-gray-500">
                  Agent Tactical Status
                </h2>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-bold text-emerald-500 tracking-wider">GEMINI 3.1 PRO: LIVE</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <VitalCard />
              </div>
            </div>
            <MissionBriefingHero />
          </section>

        </div>
      </main>

      <IntelligenceFeed /> {/* Right Sidebar Intelligence Stream */}

      {/* Strategic Initialization Modal */}
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
