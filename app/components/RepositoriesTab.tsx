'use client';

import { useState } from 'react';
import { GitBranch, Activity, Settings, ExternalLink, Plus } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  agent: string;
  model: string;
  tokens: { used: number; max: number };
  status: 'active' | 'idle' | 'error';
  lastActivity: string;
  autoCommit: boolean;
  autoDeploy: boolean;
}

const mockRepos: Repository[] = [
  {
    id: '1',
    name: 'openclaw-command-center',
    agent: 'Clawd',
    model: 'Haiku',
    tokens: { used: 15000, max: 200000 },
    status: 'active',
    lastActivity: '2m ago',
    autoCommit: true,
    autoDeploy: true,
  },
  {
    id: '2',
    name: 'app-2',
    agent: 'Agent-2',
    model: 'Sonnet',
    tokens: { used: 8000, max: 200000 },
    status: 'idle',
    lastActivity: '1h ago',
    autoCommit: false,
    autoDeploy: false,
  },
];

export default function RepositoriesTab() {
  const [repos] = useState<Repository[]>(mockRepos);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(repos[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar: Repo List */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold">Repositories</h2>
            <button className="p-1 hover:bg-gray-700 rounded">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-700">
            {repos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                className={`w-full p-4 text-left hover:bg-gray-700/50 transition-colors ${
                  selectedRepo?.id === repo.id ? 'bg-gray-700/50' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`h-2 w-2 rounded-full ${
                    repo.status === 'active' ? 'bg-green-500' :
                    repo.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-sm">{repo.name}</span>
                </div>
                <p className="text-xs text-gray-400">{repo.agent}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main: Selected Repo Dashboard */}
      <div className="lg:col-span-3">
        {selectedRepo ? (
          <div className="space-y-6">
            {/* Repo Header */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedRepo.name}</h2>
                  <p className="text-sm text-gray-400">Agent: {selectedRepo.agent}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-openclaw-orange hover:bg-openclaw-orange/80 rounded-lg font-medium transition-colors">
                    Deploy
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                    Logs
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p className="font-medium capitalize">{selectedRepo.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tokens</p>
                  <p className="font-medium">{(selectedRepo.tokens.used / 1000).toFixed(0)}K / {(selectedRepo.tokens.max / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Activity</p>
                  <p className="font-medium">{selectedRepo.lastActivity}</p>
                </div>
              </div>
            </div>

            {/* Quick Settings */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-openclaw-orange" />
                <h3 className="text-lg font-semibold">Quick Settings</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Model</label>
                  <select 
                    value={selectedRepo.model}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                  >
                    <option value="Haiku">Haiku (fast, cheap)</option>
                    <option value="Sonnet">Sonnet (balanced)</option>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="DeepSeek">DeepSeek V3</option>
                    <option value="ollama/llama3.2">Llama 3.2 (local)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Thinking Level</label>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Context Size</label>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                  >
                    <option value="8">8KB (minimal)</option>
                    <option value="16">16KB</option>
                    <option value="32">32KB</option>
                    <option value="50">50KB (full)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Memory Search</label>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedRepo.autoCommit}
                    className="rounded bg-gray-900 border-gray-700"
                  />
                  <span className="text-sm">Auto-commit changes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedRepo.autoDeploy}
                    className="rounded bg-gray-900 border-gray-700"
                  />
                  <span className="text-sm">Auto-deploy on push</span>
                </label>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-openclaw-orange" />
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              
              <div className="space-y-3">
                <ActivityItem 
                  action="Fixed Docker build issue"
                  time="5 minutes ago"
                  type="success"
                />
                <ActivityItem 
                  action="Added package-lock.json"
                  time="8 minutes ago"
                  type="success"
                />
                <ActivityItem 
                  action="Committed security fixes"
                  time="15 minutes ago"
                  type="success"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-12 text-center">
            <GitBranch className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Select a repository to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ action, time, type }: {
  action: string;
  time: string;
  type: 'success' | 'warning' | 'error';
}) {
  const colors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
      <div className={`h-2 w-2 rounded-full mt-2 ${colors[type]}`}></div>
      <div className="flex-1">
        <p className="text-sm">{action}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}
