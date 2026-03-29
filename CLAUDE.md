# Project Shield UI

## Overview
Project Shield is a portfolio management and capacity planning UI for software development teams. It helps organizations plan strategic projects, track execution, manage staff capacity, and identify staffing gaps.

## Tech Stack
- **Framework**: React 19 with Vite 7
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Icons**: Lucide React
- **State**: React hooks + localStorage persistence
- **Build**: Vite with `@vitejs/plugin-react`

## Project Structure
```
src/
├── App.jsx              # Main app with routing, state management, localStorage persistence
├── main.jsx             # Entry point
├── index.css            # Global styles
├── components/          # UI screens and reusable components
│   ├── DashboardScreen.jsx
│   ├── StrategicPlanningScreen.jsx
│   ├── TacticalPlanningScreen.jsx
│   ├── CapacityGridScreen.jsx
│   ├── StrategicCapacityScreen.jsx
│   ├── StaffRosterScreen.jsx
│   ├── TeamsScreen.jsx
│   ├── GapReportScreen.jsx
│   ├── ScenarioScreen.jsx
│   ├── ProjectDetailScreen.jsx
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   └── [Forms]          # NewProjectForm, TeamForm, AddStaffForm, etc.
├── context/
│   └── ThemeContext.jsx # Dark/light mode support
├── constants/
│   └── data.js          # Screen definitions, static data
└── utils/
    └── riskHelpers.js   # Risk color/status utilities
```

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build (outputs to `dist/`)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Concepts

### Screens (URL hash-based routing)
- `#dashboard` - Portfolio overview with risk status
- `#strategic` - Strategic planning for upcoming phases/quarters
- `#strategic-capacity` - High-level capacity planning
- `#capacity` - Daily staffing allocation grid
- `#tactical` - Execution tracker for approved projects
- `#staff` - Staff management
- `#teams` - Team management
- `#gaps` - Staffing gap report
- `#scenario` - Scenario planning tool

### Data Model
- **Phases**: Quarterly planning periods with strategic/tactical projects
- **Strategic Projects**: Have ratings (revenue, technical debt, security, customer satisfaction, strategic alignment), staffing needs, stack rank, and status (accepted/strategic/rejected)
- **Staff**: Name, role, domains, seniority, skills, team assignment, hours/day
- **Teams**: Groups of staff members

### State Persistence
Data is persisted to localStorage under keys:
- `projectshield_teams`
- `projectshield_staffRoster`
- `projectshield_phases`

## Conventions
- Components use functional React with hooks
- Dark mode supported via ThemeContext (`isDarkMode`)
- Tailwind classes used inline; dark mode uses `slate-*` palette
- Forms are modal-based (slide-over panels)
