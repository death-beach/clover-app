import { CloverRole } from '../../config/clover-roles';

class MockCloverSession {
  private currentRole: CloverRole | null = null;
  private isAuthenticated: boolean = false;

  setRole(role: CloverRole) {
    this.currentRole = role;
    this.isAuthenticated = true;
  }

  getRole() {
    return this.currentRole;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  refresh() {
    // Simulate session refresh
    return;
  }

  logout() {
    this.currentRole = null;
    this.isAuthenticated = false;
  }

  reset() {
    this.logout();
  }
}

export const mockCloverSession = new MockCloverSession();