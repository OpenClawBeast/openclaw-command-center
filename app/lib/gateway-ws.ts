// WebSocket client for OpenClaw Gateway

const GATEWAY_URL = 'wss://doc.ailoffs.com:18789';
const GATEWAY_TOKEN = '2rumec19gpkkm6gorg16hbgs5j9tp0ej';

type RequestFrame = {
  seq: number;
  method: string;
  params?: any;
};

type ResponseFrame = {
  seq: number;
  ok: boolean;
  result?: any;
  error?: any;
};

export class GatewayWebSocket {
  private ws: WebSocket | null = null;
  private seq = 0;
  private pending = new Map<number, { resolve: Function; reject: Function }>();
  private reconnectTimer: any = null;

  constructor(
    private url: string = GATEWAY_URL,
    private token: string = GATEWAY_TOKEN
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = this.url.replace(/^https/, 'wss').replace(/^http/, 'ws');
      this.ws = new WebSocket(wsUrl);
      let connected = false;

      this.ws.onopen = () => {
        // Send connect frame
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            connect: {
              token: this.token,
              clientVersion: '2026.2.6'
            }
          }));
        }
      };

      this.ws.onerror = (error) => {
        reject(error);
      };

      this.ws.onmessage = (event) => {
        const frame = JSON.parse(event.data);
        
        // HelloOk frame
        if (frame.hello && !connected) {
          connected = true;
          resolve();
          return;
        }
        
        if (frame.seq !== undefined) {
          // Response frame
          const pending = this.pending.get(frame.seq);
          if (pending) {
            this.pending.delete(frame.seq);
            if (frame.ok) {
              pending.resolve(frame.result);
            } else {
              pending.reject(frame.error);
            }
          }
        }
      };

      this.ws.onclose = () => {
        // Auto-reconnect
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      };
    });
  }

  private async call(method: string, params?: any): Promise<any> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const seq = ++this.seq;
      this.pending.set(seq, { resolve, reject });

      const frame: RequestFrame = { seq, method, params };
      this.ws!.send(JSON.stringify(frame));

      // Timeout after 30s
      setTimeout(() => {
        if (this.pending.has(seq)) {
          this.pending.delete(seq);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  // Sessions API
  async listSessions(params?: {
    limit?: number;
    activeMinutes?: number;
    includeLastMessage?: boolean;
  }) {
    return this.call('sessions.list', params);
  }

  async getSessionHistory(params: { key: string; limit?: number }) {
    return this.call('chat.history', { sessionKey: params.key, limit: params.limit });
  }

  // Agents API
  async listAgents() {
    return this.call('agents.list', {});
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
export const gatewayWs = new GatewayWebSocket();
