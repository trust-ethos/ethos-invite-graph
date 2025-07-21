# Ethos Invite Graph

A web application to visualize invitation networks on the Ethos platform using
interactive graphs and network analysis.

## Overview

This project provides a beautiful, modern interface to:

- Search for Ethos users with intelligent typeahead
- Visualize invitation connections and trust relationships
- Analyze network patterns and user interactions
- Explore the social graph of the Ethos ecosystem

## Tech Stack

- **Framework**: [Fresh](https://fresh.deno.dev/) (Deno's full-stack web
  framework)
- **Runtime**: [Deno](https://deno.land/)
- **Language**: TypeScript
- **Styling**: [Twind](https://twind.dev/) (Tailwind CSS-in-JS)
- **Deployment**: [Deno Deploy](https://deno.com/deploy)
- **API**: Ethos Network API v2

## Features

### ✅ Completed

- **Smart User Search**: Typeahead search with Ethos API integration
- **Beautiful UI**: Modern, responsive design with smooth animations
- **User Selection**: Click or keyboard navigation to select users
- **Stub Analysis Page**: Foundation for network visualization
- **TypeScript Types**: Comprehensive type definitions for Ethos API

### 🚧 In Development

- Interactive network graphs using D3.js or similar
- Invitation flow analysis and statistics
- Trust relationship visualization
- Network depth and connection metrics

## Getting Started

### Prerequisites

- [Deno](https://deno.land/manual/getting_started/installation) installed on
  your system

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ethos-invite-graph
```

2. Start the development server:

```bash
deno task start
```

3. Open your browser and navigate to `http://localhost:8000`

### Available Commands

```bash
# Start development server with hot reload
deno task start

# Run type checking and linting
deno task check

# Build for production
deno task build

# Preview production build
deno task preview

# Update Fresh framework
deno task update
```

## Project Structure

```
ethos-invite-graph/
├── routes/
│   ├── api/
│   │   └── search-users.ts      # Ethos API proxy endpoint
│   ├── analysis/
│   │   └── [userkey].tsx        # User analysis page
│   └── index.tsx                # Main landing page
├── islands/
│   └── UserSearch.tsx           # Interactive search component
├── types/
│   └── ethos.ts                 # TypeScript type definitions
├── static/                      # Static assets
├── deno.json                    # Deno configuration
├── fresh.config.ts              # Fresh framework config
├── twind.config.ts              # Styling configuration
└── ethos-api-v2-documentation.md # Complete API documentation
```

## API Integration

The application integrates with the Ethos Network API v2:

- **Base URL**: `https://api.ethos.network/api/v2`
- **User Search**: `/users/search` endpoint for typeahead functionality
- **No Authentication**: Currently using public endpoints only

### Ethos API Features Used

- User search with query parameters
- User profile information
- Score and trust level data

### Future API Integration

- Activities API for invitation data
- Reviews API for trust relationships
- XP API for user engagement metrics

## Deployment

### Deno Deploy

1. Install the Deno Deploy CLI:

```bash
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
```

2. Deploy to Deno Deploy:

```bash
deployctl deploy --project=ethos-invite-graph main.ts
```

### Environment Variables

Currently no environment variables are required. The application uses public
Ethos API endpoints.

## Development Roadmap

### Phase 1: Foundation ✅

- [x] Project setup with Fresh and Deno
- [x] User search with typeahead
- [x] Basic UI and routing
- [x] Ethos API integration
- [x] TypeScript types

### Phase 2: Network Analysis (Next)

- [ ] Invitation data fetching
- [ ] Graph visualization with D3.js
- [ ] Network statistics calculation
- [ ] Interactive node exploration

### Phase 3: Advanced Features

- [ ] Real-time data updates
- [ ] User comparison tools
- [ ] Export functionality
- [ ] Advanced filtering options

### Phase 4: Social Features

- [ ] User authentication
- [ ] Saved analyses
- [ ] Sharing capabilities
- [ ] Community insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## API Documentation

Complete Ethos API v2 documentation is available in
`ethos-api-v2-documentation.md`.

## License

[License details to be added]

## Contact

[Contact information to be added]
