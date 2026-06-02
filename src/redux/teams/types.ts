export interface TeamInfo {
  team_id: number;
  name: string;
  team_token?: string;
  is_active: boolean;
  created_at: string;
  users?: TeamMember[];
}

export interface TeamMember {
  user_id: number;
  team_id: number;
  is_active: boolean;
  created_at: string;
}

export interface TeamState {
  teams: TeamInfo[];
  currentTeam: TeamInfo | null;
  members: TeamMember[];
  importCount: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface ImportEmailsResponse {
  message: string;
  count: number;
}
