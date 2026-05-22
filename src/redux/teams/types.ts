export interface TeamInfo {
  team_id: string;
  name: string;
  team_token: string;
  is_active: boolean;
}

export interface TeamMember {
  user_id: string;
  is_active: boolean;
  created_at: string;
}

export interface TeamState {
  currentTeam: TeamInfo | null;
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
}
