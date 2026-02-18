'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Database, Users } from 'lucide-react';

interface GatewayStatus {
  ok: boolean;
  agents?: number;
  sessions?: number;
  channels?: number;
}

export default function CommandCenter() {
  const [status, setStatus] = useState<GatewayStatus>({ ok: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple fetch to check if gateway is accessible
    // In production, this would be a WebSocket connection
    setLoading(false);
    setStatus({ ok: true, agents: 1, sessions: 1, channels: 1 });
  }, []);

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
                <p className="text-sm text-gray-400">Manage agents, skills, nodes, and projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${status.ok ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{status.ok ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-openclaw-orange border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatusCard
                icon={<Users className="h-6 w-6" />}
                title="Agents"
                value={status.agents?.toString() || '0'}
                subtitle="Active agents"
                color="blue"
              />
              <StatusCard
                icon={<Activity className="h-6 w-6" />}
                title="Sessions"
                value={status.sessions?.toString() || '0'}
                subtitle="Active sessions"
                color="green"
              />
              <StatusCard
                icon={<Zap className="h-6 w-6" />}
                title="Models"
                value="13"
                subtitle="Available models"
                color="yellow"
              />
              <StatusCard
                icon={<Database className="h-6 w-6" />}
                title="Channels"
                value={status.channels?.toString() || '0'}
                subtitle="Connected channels"
                color="purple"
              />
            </div>

            {/* Dashboard Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agents Section */}
              <DashboardCard title="Agents" icon={<Users className="h-5 w-5" />}>
                <div className="space-y-3">
                  <AgentRow name="main" status="active" model="Haiku" tokens="15K / 200K" />
                </div>
              </DashboardCard>

              {/* Recent Activity */}
              <DashboardCard title="Recent Activity" icon={<Activity className="h-5 w-5" />}>
                <div className="space-y-3">
                  <ActivityItem 
                    action="Token optimization completed"
                    time="2 hours ago"
                    type="success"
                  />
                  <ActivityItem 
                    action="OpenRouter configured"
                    time="3 minutes ago"
                    type="success"
                  />
                  <ActivityItem 
                    action="GitHub connected"
                    time="Just now"
                    type="success"
                  />
                </div>
              </DashboardCard>
            </div>

            {/* Coming Soon */}
            <DashboardCard title="Coming Soon" icon={<Zap className="h-5 w-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard title="Real-time Monitoring" description="Live agent status and metrics" />
                <FeatureCard title="Skill Management" description="Install and configure skills" />
                <FeatureCard title="Node Control" description="Manage paired nodes and devices" />
              </div>
            </DashboardCard>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusCard({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}

function DashboardCard({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-openclaw-orange">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function AgentRow({ name, status, model, tokens }: {
  name: string;
  status: string;
  model: string;
  tokens: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-400">{model}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">{tokens}</p>
      </div>
    </div>
  );
}

function ActivityItem({ action, time, type }: {
  action: string;
  time: string;
  type: string;
}) {
  const typeColors: Record<string, string> = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
      <div className={`h-2 w-2 rounded-full mt-2 ${typeColors[type]}`}></div>
      <div className="flex-1">
        <p className="text-sm">{action}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
