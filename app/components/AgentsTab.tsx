'use client';

import { useState } from 'react';
import { Bot, Plus, Activity, Clock, Cpu, MessageSquare, Settings } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'main' | 'isolated' | 'sub-agent';
  status: 'active' | 'idle' | 'thinking';
  model: string;
  tokens: { used: number; max: number };
  sessions: number;
  uptime: string;
  lastActivity: string;
  thinking: 'low' | 'medium' | 'high';
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'main',
    type: 'main',
    status: 'active',
    model: 'Haiku',
    tokens: { used: 36000, max: 200000 },
    sessions: 1,
    uptime: '4h 23m',
    lastActivity: 'just now',
    thinking: 'low',
  },
  {
    id: '2',
    name: 'isolated-task-1',
    type: 'isolated',
    status: 'thinking',
    model: 'Sonnet',
    tokens: { used: 12000, max: 200000 },
    sessions: 1,
    uptime: '15m',
    lastActivity: '2s ago',
    thinking: 'high',
  },
];

export default function AgentsTab() {
  const [agents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0]);
  const [isSpawning, setIsSpawning] = useState(false);

  // Spawn form state
  const [spawnTask, setSpawnTask] = useState('');
  const [spawnModel, setSpawnModel] = useState('Haiku');
  const [spawnThinking, setSpawnThinking] = useState<'low' | 'medium' | 'high'>('low');
  const [spawnLabel, setSpawnLabel] = useState('');

  const handleSpawn = () => {
    // In real implementation, would call sessions_spawn API
    console.log('Spawning agent:', { spawnTask, spawnModel, spawnThinking, spawnLabel });
    setIsSpawning(false);
    setSpawnTask('');
    setSpawnLabel('');
  };

  return (
    <div>
      {!isSpawning ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Agent List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="font-semibold">Agents</h2>
                <button
                  onClick={() => setIsSpawning(true)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-700">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full p-4 text-left hover:bg-gray-700/50 transition-colors ${
                      selectedAgent?.id === agent.id ? 'bg-gray-700/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`h-2 w-2 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500' :
                        agent.status === 'thinking' ? 'bg-blue-500 animate-pulse' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-sm">{agent.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 capitalize">{agent.type}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <h3 className="text-sm font-semibold mb-3">Overview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Agents</span>
                  <span className="font-medium">{agents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active</span>
                  <span className="font-medium text-green-400">
                    {agents.filter(a => a.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Thinking</span>
                  <span className="font-medium text-blue-400">
                    {agents.filter(a => a.status === 'thinking').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main: Selected Agent Dashboard */}
          <div className="lg:col-span-3">
            {selectedAgent ? (
              <div className="space-y-6">
                {/* Agent Header */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-openclaw-orange/10 rounded-lg">
                        <Bot className="h-6 w-6 text-openclaw-orange" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedAgent.name}</h2>
                        <p className="text-sm text-gray-400 capitalize">{selectedAgent.type} agent</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                        View History
                      </button>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                        View Status
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      icon={<Activity className="h-4 w-4" />}
                      label="Status"
                      value={selectedAgent.status}
                      valueClass={
                        selectedAgent.status === 'active' ? 'text-green-400' :
                        selectedAgent.status === 'thinking' ? 'text-blue-400' : 'text-yellow-400'
                      }
                    />
                    <StatCard
                      icon={<Cpu className="h-4 w-4" />}
                      label="Model"
                      value={selectedAgent.model}
                    />
                    <StatCard
                      icon={<MessageSquare className="h-4 w-4" />}
                      label="Sessions"
                      value={selectedAgent.sessions.toString()}
                    />
                    <StatCard
                      icon={<Clock className="h-4 w-4" />}
                      label="Uptime"
                      value={selectedAgent.uptime}
                    />
                  </div>
                </div>

                {/* Token Usage */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold mb-4">Token Usage</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {(selectedAgent.tokens.used / 1000).toFixed(1)}K used
                      </span>
                      <span className="text-gray-400">
                        {(selectedAgent.tokens.max / 1000).toFixed(0)}K max
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-openclaw-orange rounded-full h-2 transition-all"
                        style={{ width: `${(selectedAgent.tokens.used / selectedAgent.tokens.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400">
                    Last activity: {selectedAgent.lastActivity}
                  </p>
                </div>

                {/* Agent Configuration */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-5 w-5 text-openclaw-orange" />
                    <h3 className="text-lg font-semibold">Configuration</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Model Override</label>
                      <select 
                        value={selectedAgent.model}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                      >
                        <option value="">Default (from config)</option>
                        <option value="Haiku">Haiku</option>
                        <option value="Sonnet">Sonnet</option>
                        <option value="GPT-4o">GPT-4o</option>
                        <option value="DeepSeek">DeepSeek V3</option>
                        <option value="o1">o1 (reasoning)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Thinking Level</label>
                      <select 
                        value={selectedAgent.thinking}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                      >
                        <option value="low">Low (fast)</option>
                        <option value="medium">Medium</option>
                        <option value="high">High (detailed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Max Tokens</label>
                      <input
                        type="number"
                        value={selectedAgent.tokens.max}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Timeout (seconds)</label>
                      <input
                        type="number"
                        defaultValue={300}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <button className="px-4 py-2 bg-openclaw-orange hover:bg-openclaw-orange/80 rounded-lg font-medium transition-colors">
                      Save Configuration
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
                  
                  <div className="space-y-3">
                    <MessageItem
                      role="user"
                      content="Add an Agents tab as well"
                      time="just now"
                    />
                    <MessageItem
                      role="assistant"
                      content="Creating AgentsTab component with agent management interface..."
                      time="2s ago"
                    />
                    <MessageItem
                      role="user"
                      content="Rebuild Command Center with multi-repo approach"
                      time="5m ago"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-12 text-center">
                <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select an agent to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Spawn New Agent Form
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Spawn New Agent</h2>
            <p className="text-gray-400 mt-1">
              Create an isolated sub-agent to handle a specific task
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Task Description *</label>
              <textarea
                value={spawnTask}
                onChange={(e) => setSpawnTask(e.target.value)}
                placeholder="What should this agent do?"
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Label (optional)</label>
              <input
                type="text"
                value={spawnLabel}
                onChange={(e) => setSpawnLabel(e.target.value)}
                placeholder="e.g., code-review, research-task"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Model</label>
                <select 
                  value={spawnModel}
                  onChange={(e) => setSpawnModel(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                >
                  <option value="Haiku">Haiku (fast, cheap)</option>
                  <option value="Sonnet">Sonnet (balanced)</option>
                  <option value="GPT-4o">GPT-4o</option>
                  <option value="o1">o1 (reasoning)</option>
                  <option value="DeepSeek">DeepSeek V3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Thinking Level</label>
                <select 
                  value={spawnThinking}
                  onChange={(e) => setSpawnThinking(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSpawn}
                disabled={!spawnTask.trim()}
                className="px-6 py-2 bg-openclaw-orange hover:bg-openclaw-orange/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Spawn Agent
              </button>
              <button
                onClick={() => setIsSpawning(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, valueClass = '' }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-3">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={`font-semibold capitalize ${valueClass}`}>{value}</p>
    </div>
  );
}

function MessageItem({ role, content, time }: {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}) {
  return (
    <div className={`p-3 rounded-lg ${
      role === 'user' ? 'bg-blue-500/10' : 'bg-gray-900/50'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-400 capitalize">{role}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm">{content}</p>
    </div>
  );
}
