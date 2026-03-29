import { BarChart3, Calendar, AlertTriangle, Zap, Lightbulb, ClipboardList, Users, UsersRound, LayoutGrid, Mail } from 'lucide-react';

export const screens = [
  { id: 'dashboard', name: 'Portfolio Dashboard', icon: BarChart3 },
  { id: 'strategic', name: 'Strategic Planning', icon: Lightbulb },
  { id: 'strategic-capacity', name: 'Strategic Capacity', icon: LayoutGrid },
  { id: 'capacity', name: 'Daily Capacity Grid', icon: Calendar },
  { id: 'tactical', name: 'Execution Tracker', icon: ClipboardList },
  { id: 'staff', name: 'Staff', icon: Users },
  { id: 'teams', name: 'Teams', icon: UsersRound },
  { id: 'invitations', name: 'Invitations', icon: Mail, adminOnly: true },
  { id: 'gaps', name: 'Gap Report', icon: AlertTriangle },
  { id: 'scenario', name: 'Scenario Planner', icon: Zap },
];

export const screenTitles = {
  dashboard: { title: 'Portfolio Dashboard', subtitle: 'Overview of all projects and risk status' },
  strategic: { title: 'Strategic Planning', subtitle: 'Plan and prioritize project ideas for upcoming phases' },
  tactical: { title: 'Execution Tracker', subtitle: 'Track and manage approved projects in progress' },
  capacity: { title: 'Daily Capacity Grid', subtitle: 'Staffing allocation across projects and time' },
  'strategic-capacity': { title: 'Strategic Capacity', subtitle: 'High-level capacity planning view' },
  staff: { title: 'Staff', subtitle: 'Manage your team members' },
  teams: { title: 'Teams', subtitle: 'Manage your teams and assignments' },
  project: { title: 'Project Detail', subtitle: 'Website Redesign' },
  invitations: { title: 'Member Invitations', subtitle: 'Invite and manage organization members' },
  gaps: { title: 'Gap Report', subtitle: 'Staffing shortfalls across your portfolio' },
  scenario: { title: 'Scenario Planner', subtitle: 'Model the impact of staffing changes' },
};
