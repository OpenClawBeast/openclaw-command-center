'use client';

import { useState } from 'react';
import { FolderGit2, Wrench, Server } from 'lucide-react';
import RepositoriesTab from './components/RepositoriesTab';
import SkillsTab from './components/SkillsTab';
import NodesTab from './components/NodesTab';

type Tab = 'repositories' | 'skills' | 'nodes';

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState<Tab>('repositories');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🦞</div>
              <div>
                <h1 className="text-2xl font-bold">OpenClaw Command Center</h1>
                <p className="text-sm text-gray-400">Manage repositories, skills, and nodes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-700 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <div className="flex gap-6">
            <TabButton
              active={activeTab === 'repositories'}
              onClick={() => setActiveTab('repositories')}
              icon={<FolderGit2 className="h-4 w-4" />}
              label="Repositories"
            />
            <TabButton
              active={activeTab === 'skills'}
              onClick={() => setActiveTab('skills')}
              icon={<Wrench className="h-4 w-4" />}
              label="Skills"
            />
            <TabButton
              active={activeTab === 'nodes'}
              onClick={() => setActiveTab('nodes')}
              icon={<Server className="h-4 w-4" />}
              label="Nodes"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'repositories' && <RepositoriesTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'nodes' && <NodesTab />}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
        active
          ? 'border-openclaw-orange text-white'
          : 'border-transparent text-gray-400 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
