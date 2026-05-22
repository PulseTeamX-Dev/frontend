export interface User {
  id: string;
  email: string;
  role: "hr" | "team_lead" | "admin";
  team_id?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
