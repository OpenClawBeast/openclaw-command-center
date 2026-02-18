'use client';

import { Server, Smartphone, Camera, MapPin, Activity } from 'lucide-react';

const mockNodes = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    status: 'connected',
    lastSeen: '2m ago',
    capabilities: ['camera', 'location', 'notifications'],
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    status: 'connected',
    lastSeen: 'just now',
    capabilities: ['screen', 'camera', 'files'],
  },
];

export default function NodesTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Nodes</h2>
        <p className="text-gray-400">
          Manage paired devices and nodes (Coming Soon)
        </p>
      </div>

      {/* Mock Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockNodes.map((node) => (
          <div
            key={node.id}
            className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 opacity-50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                {node.type === 'mobile' ? (
                  <Smartphone className="h-5 w-5 text-blue-400" />
                ) : (
                  <Server className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div className={`h-2 w-2 rounded-full ${
                node.status === 'connected' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
            </div>

            <h3 className="text-lg font-semibold mb-2">{node.name}</h3>
            <p className="text-sm text-gray-400 mb-4">Last seen: {node.lastSeen}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {node.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-1 bg-gray-700 rounded text-xs"
                >
                  {cap}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                disabled
                className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                Configure
              </button>
              <button
                disabled
                className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Features */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">Coming Soon</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Camera className="h-6 w-6" />}
            title="Camera Access"
            description="Snap photos and record clips from paired devices"
          />
          <FeatureCard
            icon={<MapPin className="h-6 w-6" />}
            title="Location Services"
            description="Get real-time location from mobile nodes"
          />
          <FeatureCard
            icon={<Activity className="h-6 w-6" />}
            title="Remote Commands"
            description="Execute commands on remote nodes"
          />
          <FeatureCard
            icon={<Server className="h-6 w-6" />}
            title="Node Pairing"
            description="Approve and manage device connections"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex p-3 bg-gray-700/50 rounded-lg mb-3 text-gray-400">
        {icon}
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
