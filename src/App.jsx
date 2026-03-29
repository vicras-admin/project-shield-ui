import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, useOrganization, useOrganizationList } from '@clerk/clerk-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import FeaturesPage from './components/FeaturesPage';
import CustomersPage from './components/CustomersPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import SecurityPage from './components/SecurityPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import DashboardScreen from './components/DashboardScreen';
import StrategicPlanningScreen from './components/StrategicPlanningScreen';
import TacticalPlanningScreen from './components/TacticalPlanningScreen';
import CapacityGridScreen from './components/CapacityGridScreen';
import StrategicCapacityScreen from './components/StrategicCapacityScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import GapReportScreen from './components/GapReportScreen';
import ScenarioScreen from './components/ScenarioScreen';
import StaffRosterScreen from './components/StaffRosterScreen';
import TeamsScreen from './components/TeamsScreen';
import InvitationsScreen from './components/InvitationsScreen';
import AcceptInvitePage from './components/AcceptInvitePage';
import { screenTitles } from './constants/data';
import { teamApi, staffApi, phaseApi } from './services/api';

// Valid screens for deep linking (excludes landing)
const VALID_SCREENS = ['dashboard', 'strategic', 'strategic-capacity', 'tactical', 'capacity', 'staff', 'teams', 'invitations', 'gaps', 'scenario'];

// Public screens accessible without auth (by hash prefix)
const PUBLIC_SCREENS = ['accept-invite'];

// Get screen from URL hash - returns 'landing' for empty hash or invalid screens
const getScreenFromHash = () => {
  const hash = window.location.hash.slice(1); // Remove the '#'
  if (!hash) return 'landing';
  // Check for public screens with query params (e.g., accept-invite?token=xxx)
  const screenId = hash.split('?')[0];
  if (PUBLIC_SCREENS.includes(screenId)) return screenId;
  return VALID_SCREENS.includes(hash) ? hash : 'landing';
};

function AppContent() {
  const { isDarkMode } = useTheme();
  const { isSignedIn, isLoaded } = useAuth();
  const { organization } = useOrganization();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const [activeScreen, setActiveScreen] = useState(getScreenFromHash);
  const [selectedProject, setSelectedProject] = useState(null);

  // State for API data
  const [teams, setTeams] = useState([]);
  const [staffRoster, setStaffRoster] = useState([]);
  const [phases, setPhases] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch all data from API (called after authentication)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [teamsData, staffData, phasesData] = await Promise.all([
        teamApi.getAll(),
        staffApi.getAll(),
        phaseApi.getAll(),
      ]);
      setTeams(teamsData);
      setStaffRoster(staffData);
      setPhases(phasesData);
      setDataFetched(true);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-activate the user's organization after sign-in
  useEffect(() => {
    if (isSignedIn && !organization && userMemberships?.data?.length > 0 && setActive) {
      const orgId = userMemberships.data[0].organization.id;
      setActive({ organization: orgId });
    }
  }, [isSignedIn, organization, userMemberships, setActive]);

  // Fetch data when user signs in and organization is active
  useEffect(() => {
    if (isSignedIn && organization && !dataFetched) {
      fetchData();
      // Navigate to dashboard if on auth screens
      if (['landing', 'signin', 'signup'].includes(activeScreen)) {
        setActiveScreen('dashboard');
      }
    }
  }, [isSignedIn, organization, dataFetched, fetchData, activeScreen]);

  // Update URL hash when screen changes
  useEffect(() => {
    const currentHash = window.location.hash.slice(1);
    if (currentHash !== activeScreen) {
      window.history.pushState(null, '', `#${activeScreen}`);
    }
  }, [activeScreen]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const screen = getScreenFromHash();
      setActiveScreen(screen);
      // Clear selected project when navigating away from project screen
      if (screen !== 'project') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleUpdatePhases = async (newPhases) => {
    // For now, update local state - individual phase/project updates happen via specific handlers
    setPhases(newPhases);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setActiveScreen('project');
  };

  const handleNavigateToTactical = () => {
    setActiveScreen('tactical');
  };

  const handleNavigateToStrategic = () => {
    setActiveScreen('strategic');
  };

  const handleEnterApp = () => {
    setActiveScreen('signin');
  };

  const [registrationData, setRegistrationData] = useState(null);

  const handleNavigateToSignIn = (data = null) => {
    setRegistrationData(data);
    setActiveScreen('signin');
  };

  const handleNavigateToSignUp = () => {
    setActiveScreen('signup');
  };

  const handleNavigateToForgotPassword = () => {
    setActiveScreen('forgot-password');
  };

  const handleNavigateToLanding = () => {
    setActiveScreen('landing');
  };

  const handleNavigateToPricing = () => {
    setActiveScreen('pricing');
  };

  const handleNavigateToFeatures = () => {
    setActiveScreen('features');
  };

  const handleNavigateToCustomers = () => {
    setActiveScreen('customers');
  };

  const handleNavigateToAbout = () => {
    setActiveScreen('about');
  };

  const handleNavigateToContact = () => {
    setActiveScreen('contact');
  };

  const handleNavigateToSecurity = () => {
    setActiveScreen('security');
  };

  const handleNavigateToPrivacy = () => {
    setActiveScreen('privacy');
  };

  const handleNavigateToTerms = () => {
    setActiveScreen('terms');
  };

  const handleSignOut = () => {
    // Reset app state after sign out
    setDataFetched(false);
    setTeams([]);
    setStaffRoster([]);
    setPhases([]);
    setActiveScreen('landing');
  };

  const handleAddStaffMember = async (staffData) => {
    try {
      const newStaff = await staffApi.create(staffData);
      setStaffRoster(prev => [...prev, newStaff]);
    } catch (err) {
      console.error('Error adding staff member:', err);
      throw err;
    }
  };

  const handleEditStaffMember = async (staffData, staffId) => {
    try {
      const updatedStaff = await staffApi.update(staffId, staffData);
      setStaffRoster(prev => prev.map(staff =>
        staff.id === staffId ? updatedStaff : staff
      ));
    } catch (err) {
      console.error('Error updating staff member:', err);
      throw err;
    }
  };

  const handleDeleteStaffMember = async (staffId) => {
    try {
      await staffApi.delete(staffId);
      setStaffRoster(prev => prev.filter(staff => staff.id !== staffId));
    } catch (err) {
      console.error('Error deleting staff member:', err);
      throw err;
    }
  };

  const handleAddTeam = async (teamData, assignedStaffIds) => {
    try {
      const newTeam = await teamApi.create(teamData);
      setTeams(prev => [...prev, newTeam]);

      // Update staff with new team assignments
      if (assignedStaffIds && assignedStaffIds.length > 0) {
        const updatePromises = assignedStaffIds.map(staffId => {
          const staff = staffRoster.find(s => s.id === staffId);
          if (staff) {
            return staffApi.update(staffId, { ...staff, teamId: newTeam.id });
          }
          return Promise.resolve();
        });
        await Promise.all(updatePromises);
        // Refresh staff data
        const updatedStaff = await staffApi.getAll();
        setStaffRoster(updatedStaff);
      }
    } catch (err) {
      console.error('Error adding team:', err);
      throw err;
    }
  };

  const handleEditTeam = async (teamData, assignedStaffIds) => {
    try {
      const updatedTeam = await teamApi.update(teamData.id, teamData);
      setTeams(prev => prev.map(team =>
        team.id === teamData.id ? updatedTeam : team
      ));

      // Update staff assignments
      const currentTeamMembers = staffRoster.filter(s => s.teamId === teamData.id);
      const updatePromises = [];

      // Remove staff no longer assigned to this team
      for (const staff of currentTeamMembers) {
        if (!assignedStaffIds.includes(staff.id)) {
          updatePromises.push(staffApi.update(staff.id, { ...staff, teamId: null }));
        }
      }

      // Add newly assigned staff to this team
      for (const staffId of assignedStaffIds) {
        const staff = staffRoster.find(s => s.id === staffId);
        if (staff && staff.teamId !== teamData.id) {
          updatePromises.push(staffApi.update(staffId, { ...staff, teamId: teamData.id }));
        }
      }

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        // Refresh staff data
        const updatedStaff = await staffApi.getAll();
        setStaffRoster(updatedStaff);
      }
    } catch (err) {
      console.error('Error updating team:', err);
      throw err;
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await teamApi.delete(teamId);
      setTeams(prev => prev.filter(team => team.id !== teamId));
      // Unassign staff that were on this team
      const updatedStaff = await staffApi.getAll();
      setStaffRoster(updatedStaff);
    } catch (err) {
      console.error('Error deleting team:', err);
      throw err;
    }
  };

  const handleRefreshData = () => {
    fetchData();
  };

  const getScreenTitle = () => {
    if (activeScreen === 'project' && selectedProject) {
      return { ...screenTitles.project, subtitle: selectedProject.name };
    }
    return screenTitles[activeScreen];
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen phases={phases} onProjectSelect={handleProjectSelect} />;
      case 'strategic':
        return <StrategicPlanningScreen onProjectSelect={handleProjectSelect} onNavigateToTactical={handleNavigateToTactical} phases={phases} onUpdatePhases={handleUpdatePhases} onRefresh={handleRefreshData} />;
      case 'tactical':
        return <TacticalPlanningScreen onNavigateToStrategic={handleNavigateToStrategic} />;
      case 'capacity':
        return <CapacityGridScreen staffRoster={staffRoster} phases={phases} />;
      case 'strategic-capacity':
        return <StrategicCapacityScreen staffRoster={staffRoster} phases={phases} onUpdatePhases={handleUpdatePhases} />;
      case 'staff':
        return <StaffRosterScreen staffRoster={staffRoster} teams={teams} onAddStaff={handleAddStaffMember} onEditStaff={handleEditStaffMember} onDeleteStaff={handleDeleteStaffMember} onRefresh={handleRefreshData} />;
      case 'teams':
        return <TeamsScreen teams={teams} staffRoster={staffRoster} onAddTeam={handleAddTeam} onEditTeam={handleEditTeam} onDeleteTeam={handleDeleteTeam} onRefresh={handleRefreshData} />;
      case 'invitations':
        return <InvitationsScreen />;
      case 'project':
        return <ProjectDetailScreen selectedProject={selectedProject} />;
      case 'gaps':
        return <GapReportScreen phases={phases} />;
      case 'scenario':
        return <ScenarioScreen />;
      default:
        return <DashboardScreen phases={phases} onProjectSelect={handleProjectSelect} />;
    }
  };

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className={`flex h-screen items-center justify-center font-sans ${
        isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
            isDarkMode ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages without loading state or layout
  if (activeScreen === 'landing') {
    return (
      <LandingPage
        onEnterApp={handleEnterApp}
        onPricing={handleNavigateToPricing}
        onFeatures={handleNavigateToFeatures}
        onCustomers={handleNavigateToCustomers}
        onAbout={handleNavigateToAbout}
        onContact={handleNavigateToContact}
        onSecurity={handleNavigateToSecurity}
        onPrivacy={handleNavigateToPrivacy}
        onTerms={handleNavigateToTerms}
      />
    );
  }

  if (activeScreen === 'pricing') {
    return (
      <PricingPage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
      />
    );
  }

  if (activeScreen === 'features') {
    return (
      <FeaturesPage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
        onPricing={handleNavigateToPricing}
      />
    );
  }

  if (activeScreen === 'customers') {
    return (
      <CustomersPage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
        onPricing={handleNavigateToPricing}
      />
    );
  }

  if (activeScreen === 'about') {
    return (
      <AboutPage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
        onPricing={handleNavigateToPricing}
      />
    );
  }

  if (activeScreen === 'contact') {
    return (
      <ContactPage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
        onPricing={handleNavigateToPricing}
      />
    );
  }

  if (activeScreen === 'security') {
    return (
      <SecurityPage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
        onPricing={handleNavigateToPricing}
      />
    );
  }

  if (activeScreen === 'privacy') {
    return (
      <PrivacyPolicyPage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
      />
    );
  }

  if (activeScreen === 'terms') {
    return (
      <TermsOfServicePage
        onBack={handleNavigateToLanding}
        onGetStarted={handleEnterApp}
      />
    );
  }

  if (activeScreen === 'accept-invite') {
    return (
      <AcceptInvitePage
        onBack={handleNavigateToLanding}
        onSignIn={handleNavigateToSignIn}
      />
    );
  }

  if (activeScreen === 'signin') {
    return (
      <SignInPage
        onBack={handleNavigateToLanding}
        onSignUp={handleNavigateToSignUp}
        onForgotPassword={handleNavigateToForgotPassword}
        registrationData={registrationData}
        onClearRegistrationData={() => setRegistrationData(null)}
      />
    );
  }

  if (activeScreen === 'signup') {
    return (
      <SignUpPage
        onBack={handleNavigateToLanding}
        onSignIn={handleNavigateToSignIn}
      />
    );
  }

  if (activeScreen === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onBack={handleNavigateToSignIn}
        onSignIn={handleNavigateToSignIn}
      />
    );
  }

  // Redirect to landing if not authenticated and trying to access protected screens
  if (!isSignedIn) {
    return (
      <LandingPage
        onEnterApp={handleEnterApp}
        onPricing={handleNavigateToPricing}
        onFeatures={handleNavigateToFeatures}
        onCustomers={handleNavigateToCustomers}
        onAbout={handleNavigateToAbout}
        onContact={handleNavigateToContact}
        onSecurity={handleNavigateToSecurity}
        onPrivacy={handleNavigateToPrivacy}
        onTerms={handleNavigateToTerms}
      />
    );
  }

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center font-sans ${
        isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
            isDarkMode ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex h-screen items-center justify-center font-sans ${
        isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
      }`}>
        <div className="text-center max-w-md">
          <div className={`text-red-500 text-6xl mb-4`}>⚠</div>
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Failed to Load Data
          </h2>
          <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen font-sans ${
      isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
    }`}>
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header {...getScreenTitle()} onSignOut={handleSignOut} />
        <div className="flex-1 overflow-auto">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
