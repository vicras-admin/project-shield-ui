/**
 * Global teardown for Clerk integration tests.
 *
 * Cleans up test users and organizations created during the test run
 * by searching for resources matching the test naming conventions:
 *   - Users with email matching "testuser+clerk_test_*@example.com"
 *   - Organizations with name matching "Test Org *"
 *
 * Also catches orphaned resources from previous failed runs.
 */

const CLERK_API_BASE = 'https://api.clerk.com/v1';
const BACKEND_API_BASE = 'http://localhost:8080/api';

export default async function globalTeardown() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    console.warn('[clerk-teardown] CLERK_SECRET_KEY not set — skipping cleanup');
    return;
  }

  const headers = {
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
  };

  try {
    await cleanupUsers(headers);
    await cleanupOrganizations(headers);
    console.log('[clerk-teardown] Cleanup complete');
  } catch (err) {
    // Log but don't fail the test run — teardown errors shouldn't mask test results
    console.error('[clerk-teardown] Cleanup error:', err.message);
  }
}

async function cleanupUsers(headers) {
  // Clerk's list users API supports email_address query
  const res = await fetch(
    `${CLERK_API_BASE}/users?email_address=${encodeURIComponent('testuser+clerk_test_')}@example.com&limit=100`,
    { headers },
  );

  if (!res.ok) {
    // Fall back to listing all and filtering client-side
    console.warn(`[clerk-teardown] User search returned ${res.status}, trying broad search`);
    return cleanupUsersBroad(headers);
  }

  const users = await res.json();
  const testUsers = (Array.isArray(users) ? users : users.data || []).filter((u) =>
    u.email_addresses?.some((e) => e.email_address?.startsWith('testuser+clerk_test_')),
  );

  console.log(`[clerk-teardown] Found ${testUsers.length} test user(s) to clean up`);

  for (const user of testUsers) {
    await deleteUser(user.id, headers);
  }
}

async function cleanupUsersBroad(headers) {
  const res = await fetch(`${CLERK_API_BASE}/users?limit=100&order_by=-created_at`, { headers });
  if (!res.ok) {
    console.error(`[clerk-teardown] Failed to list users: ${res.status}`);
    return;
  }

  const users = await res.json();
  const testUsers = (Array.isArray(users) ? users : users.data || []).filter((u) =>
    u.email_addresses?.some((e) => e.email_address?.startsWith('testuser+clerk_test_')),
  );

  console.log(`[clerk-teardown] Found ${testUsers.length} test user(s) to clean up (broad search)`);

  for (const user of testUsers) {
    await deleteUser(user.id, headers);
  }
}

async function deleteUser(userId, headers) {
  const res = await fetch(`${CLERK_API_BASE}/users/${userId}`, {
    method: 'DELETE',
    headers,
  });

  if (res.ok) {
    console.log(`[clerk-teardown] Deleted user ${userId}`);
  } else {
    console.warn(`[clerk-teardown] Failed to delete user ${userId}: ${res.status}`);
  }
}

async function cleanupOrganizations(headers) {
  const res = await fetch(`${CLERK_API_BASE}/organizations?limit=100&order_by=-created_at`, { headers });
  if (!res.ok) {
    console.error(`[clerk-teardown] Failed to list organizations: ${res.status}`);
    return;
  }

  const orgs = await res.json();
  const testOrgs = (Array.isArray(orgs) ? orgs : orgs.data || []).filter((o) =>
    o.name?.startsWith('Test Org '),
  );

  console.log(`[clerk-teardown] Found ${testOrgs.length} test organization(s) to clean up`);

  for (const org of testOrgs) {
    const delRes = await fetch(`${CLERK_API_BASE}/organizations/${org.id}`, {
      method: 'DELETE',
      headers,
    });

    if (delRes.ok) {
      console.log(`[clerk-teardown] Deleted organization ${org.id} (${org.name})`);
    } else {
      console.warn(`[clerk-teardown] Failed to delete organization ${org.id}: ${delRes.status}`);
    }
  }
}
