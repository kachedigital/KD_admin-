'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProjectHero from '@/components/ProjectHero';
import ExecutiveDirective from '@/components/ExecutiveDirective';
import MissionBriefingHero from '@/components/MissionBriefingHero';
import IntelligenceFeed from '@/components/IntelligenceFeed';
import NewProjectModal from '@/components/NewProjectModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#05010a] text-white overflow-hidden">
      <Sidebar /> {/* Left Navigation */}

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="KACHE DIGITAL HQ" /> {/* Top Breadcrumbs & Profile */}

        <div className="flex-1 overflow-y-auto p-10 space-y-16 custom-scrollbar">

          {/* 1. HERO: Project Summary Cards */}
          <ProjectHero onInitialize={() => setIsModalOpen(true)} />

          {/* 2. COMMAND: Founder's Desk */}
          <section className="flex justify-center">
            <div className="w-full max-w-5xl">
              <ExecutiveDirective />
            </div>
          </section>

          {/* 3. TACTICAL: Agent Cards Grid */}
          <section>
            <h2 className="font-monument text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-8 px-2">
              Agent Tactical Status
            </h2>
            <MissionBriefingHero />
          </section>

        </div>
      </main>

      <IntelligenceFeed /> {/* Right Sidebar Intelligence Stream */}

      {/* Strategic Initialization Modal */}
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
