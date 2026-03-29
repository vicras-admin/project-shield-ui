/**
 * Mock implementation of @clerk/clerk-react for e2e tests.
 * Simulates a signed-in admin user so the app loads directly into the dashboard.
 */

const mockUser = {
  id: 'test-user',
  firstName: 'Test',
  lastName: 'Admin',
  fullName: 'Test Admin',
  primaryEmailAddress: { emailAddress: 'admin@test.com' },
  imageUrl: null,
};

// Set up window.Clerk so api.js getAuthToken() works
if (typeof window !== 'undefined') {
  window.Clerk = {
    session: {
      getToken: async () => 'test-token-admin',
    },
  };
}

export function ClerkProvider({ children }) {
  return children;
}

export function useAuth() {
  return {
    isSignedIn: true,
    isLoaded: true,
    userId: 'test-user',
    sessionId: 'test-session',
    orgId: 'org_test_default',
    orgRole: 'admin',
    getToken: async () => 'test-token-admin',
  };
}

export function useUser() {
  return {
    isSignedIn: true,
    isLoaded: true,
    user: mockUser,
  };
}

export function useClerk() {
  return {
    signOut: async () => {},
    session: { getToken: async () => 'test-token-admin' },
    user: mockUser,
  };
}

export function useSignIn() {
  return {
    isLoaded: true,
    signIn: { create: async () => ({}) },
    setActive: async () => {},
  };
}

export function useSignUp() {
  return {
    isLoaded: true,
    signUp: { create: async () => ({}) },
    setActive: async () => {},
  };
}

export function SignedIn({ children }) {
  return children;
}

export function SignedOut({ children }) {
  return null;
}

export function useOrganization() {
  return {
    organization: { id: 'org_test_default', name: 'Test Org' },
    isLoaded: true,
  };
}

export function useOrganizationList() {
  return {
    setActive: async () => {},
    userMemberships: {
      data: [{ organization: { id: 'org_test_default', name: 'Test Org' } }],
    },
    isLoaded: true,
  };
}
