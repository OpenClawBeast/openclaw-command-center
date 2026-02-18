# OpenClaw Command Center

Graphical web interface for managing OpenClaw agents, skills, nodes, and projects.

## Features

### Phase 1 (Current)
- ✅ Agent status dashboard
- ✅ System monitoring
- ✅ Token usage visibility
- ✅ Model overview

### Phase 2 (Coming Soon)
- 🔄 Real-time WebSocket connection to Gateway
- 🔄 Live agent metrics and token usage graphs
- 🔄 Skill management (install, update, configure)
- 🔄 Node control panel
- 🔄 Project tracking

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Via Dokploy

1. Connect this GitHub repository to Dokploy
2. Configure environment variables (if needed)
3. Deploy automatically on push

### Docker

```bash
# Build
docker build -t openclaw-command-center .

# Run
docker run -p 3000:3000 openclaw-command-center
```

## Configuration

The Command Center connects to the OpenClaw Gateway WebSocket API:
- **Default Gateway URL**: `wss://doc.ai1offs.com:18789`
- Gateway authentication uses the existing OpenClaw token

## Architecture

```
Command Center (Next.js)
       ↓
  WebSocket/HTTP
       ↓
OpenClaw Gateway API
       ↓
  Agents, Skills, Nodes
```

## License

MIT

---

Built with 🦞 by OpenClaw
# Force rebuild
