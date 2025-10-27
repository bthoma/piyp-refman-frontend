export interface User {
  id: string;
  email: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  auth_provider: 'email' | 'google' | 'apple';
  last_login_at: string | null;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  is_admin: boolean;
  monthly_budget_usd: number;
  current_month_spent_usd: number;
  budget_alert_threshold: number;
  timezone: string;
  default_citation_style: string;
  ai_features_enabled: boolean;
  auto_ingest_uploads: boolean;
  rag_search_enabled: boolean;
  kg_search_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    profile: UserProfile;
  };
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileUpdate {
  full_name?: string;
  timezone?: string;
  default_citation_style?: string;
  ai_features_enabled?: boolean;
  auto_ingest_uploads?: boolean;
  rag_search_enabled?: boolean;
  kg_search_enabled?: boolean;
}
