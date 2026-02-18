// Gateway API client for OpenClaw Command Center

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_GATEWAY_TOKEN || '';

interface GatewayResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

class GatewayAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string = GATEWAY_URL, token: string = GATEWAY_TOKEN) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<GatewayResponse<T>> {
    try {
      const url = `${this.baseUrl}${path}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        return {
          ok: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Sessions / Agents API
  async listSessions(options: {
    kinds?: string[];
    activeMinutes?: number;
    limit?: number;
    messageLimit?: number;
  } = {}) {
    const params = new URLSearchParams();
    if (options.kinds) params.set('kinds', options.kinds.join(','));
    if (options.activeMinutes) params.set('activeMinutes', String(options.activeMinutes));
    if (options.limit) params.set('limit', String(options.limit));
    if (options.messageLimit) params.set('messageLimit', String(options.messageLimit));

    return this.fetch(`/api/sessions?${params.toString()}`);
  }

  async getSessionHistory(sessionKey: string, options: {
    limit?: number;
    includeTools?: boolean;
  } = {}) {
    const params = new URLSearchParams();
    params.set('sessionKey', sessionKey);
    if (options.limit) params.set('limit', String(options.limit));
    if (options.includeTools) params.set('includeTools', 'true');

    return this.fetch(`/api/sessions/history?${params.toString()}`);
  }

  async getSessionStatus(sessionKey?: string) {
    const params = new URLSearchParams();
    if (sessionKey) params.set('sessionKey', sessionKey);

    return this.fetch(`/api/sessions/status?${params.toString()}`);
  }

  async spawnSession(options: {
    task: string;
    agentId?: string;
    model?: string;
    thinking?: string;
    label?: string;
    cleanup?: 'delete' | 'keep';
    runTimeoutSeconds?: number;
  }) {
    return this.fetch('/api/sessions/spawn', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async sendToSession(options: {
    message: string;
    sessionKey?: string;
    label?: string;
    agentId?: string;
    timeoutSeconds?: number;
  }) {
    return this.fetch('/api/sessions/send', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  // Skills API (file operations via Gateway)
  async listSkills() {
    return this.fetch('/api/skills');
  }

  async getSkill(skillName: string) {
    return this.fetch(`/api/skills/${skillName}`);
  }

  async createSkill(skill: {
    name: string;
    description: string;
    files: Array<{ name: string; content: string }>;
  }) {
    return this.fetch('/api/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  }

  async updateSkill(skillName: string, skill: {
    description?: string;
    files?: Array<{ name: string; content: string }>;
  }) {
    return this.fetch(`/api/skills/${skillName}`, {
      method: 'PATCH',
      body: JSON.stringify(skill),
    });
  }

  async deleteSkill(skillName: string) {
    return this.fetch(`/api/skills/${skillName}`, {
      method: 'DELETE',
    });
  }

  // Nodes API
  async listNodes() {
    return this.fetch('/api/nodes');
  }

  async getNodeStatus(nodeId: string) {
    return this.fetch(`/api/nodes/${nodeId}/status`);
  }

  // Gateway Config
  async getConfig() {
    return this.fetch('/api/config');
  }

  async updateConfig(config: any) {
    return this.fetch('/api/config', {
      method: 'PATCH',
      body: JSON.stringify(config),
    });
  }
}

// Singleton instance
export const gatewayAPI = new GatewayAPI();

export default GatewayAPI;
