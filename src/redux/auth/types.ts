export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface UserMetadata {
  role: "admin" | "hr" | "team_lead";
}

export interface IdentityData {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
}

export interface Identity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}

export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at?: string;
  phone: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
  weak_password?: boolean | null;
}

export interface InviteContext {
  
  invite_id: number;
  email: string;
  dashboard_role: "hr" | "team_lead";
  team_id: number;
  team?: {
    name: string;
  };
}

export interface ActivatePayload {
  token: string;
  password: string;
}


