export interface Profile {
  dashboard_user_id: number;
  auth_id: string;
  email: string;
  full_name: string | null;
  dashboard_role: string;
  custom_title: string | null;
  avatar_url: string | null;
  team_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  avatar_url?: string;
}

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}
