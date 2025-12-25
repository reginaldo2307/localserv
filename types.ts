
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  is_admin?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  city: string;
  created_at: string;
  is_admin?: boolean;
  blocked?: boolean;
  subscription?: Subscription; // Joined data
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  ad_limit: number;
  has_premium_badge: boolean;
  priority_search: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive';
  expires_at: string;
  created_at: string;
  plans?: Plan; // Joined data
}

export interface Service {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  active: boolean;
  image_url?: string;
  created_at: string;
  profiles?: Profile; // Joined data
  service_highlights?: ServiceHighlight[]; // Joined data
  highlighted_until?: string; // Cache field
}

export interface ServiceHighlight {
  id: string;
  service_id: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export interface ServiceInput {
  title: string;
  description: string;
  price: number;
  city: string;
  image_url?: string;
}
