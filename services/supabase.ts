
import { createClient } from '@supabase/supabase-js';
import { Service, ServiceInput } from '../types';

// TODO: Move these to .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials missing. Check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signUp = async (email: string, password: string, name: string, city: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                city
            }
        }
    });
    return { data, error };
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getServices = async (cityFilter?: string) => {
    let query = supabase
        .from('services')
        .select('*, profiles(name, city, avatar_url, created_at, last_active_at, phone_whatsapp, bio, subscriptions(status, expires_at, plans(has_premium_badge, name)))')
        .eq('active', true)
        .order('highlighted_until', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

    if (cityFilter) {
        query = query.ilike('city', `%${cityFilter}%`);
    }

    const { data, error } = await query;
    return { data: data as Service[], error };
};

export const createService = async (service: ServiceInput) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('services')
        .insert([
            {
                user_id: user.id,
                ...service,
                active: true
            }
        ])
        .select()
        .single();

    return { data, error };
};


export const getService = async (id: string) => {
    const { data, error } = await supabase
        .from('services')
        .select('*, profiles(id, name, city, avatar_url, bio, created_at, last_active_at, phone_whatsapp)')
        .eq('id', id)
        .single();
    return { data: data as Service, error };
};

export const getMyServices = async () => {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return { data: data as Service[], error };
};

export const updateServiceStatus = async (serviceId: string, active: boolean) => {
    const { data, error } = await supabase
        .from('services')
        .update({ active })
        .eq('id', serviceId)
        .select();
    return { data, error };
};

export const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const uploadAvatar = async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const updateService = async (id: string, updates: Partial<ServiceInput>) => {
    const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
};

export const deleteService = async (serviceId: string) => {
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
    return { error };
};

export const updateServiceVerification = async (id: string, is_verified: boolean) => {
    const { data, error } = await supabase
        .from('services')
        .update({ is_verified })
        .eq('id', id)
        .select()
        .single();
    return { data, error };
};

// Admin Functions

export const getAdminStats = async () => {
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
    const { count: activeServicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true }).eq('active', true);

    return {
        users: usersCount || 0,
        services: servicesCount || 0,
        activeServices: activeServicesCount || 0
    };
};

export const getAllServices = async () => {
    const { data, error } = await supabase
        .from('services')
        .select('*, profiles(name, email, city)')
        .order('created_at', { ascending: false });
    return { data: data as Service[], error };
};

export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) console.error('Admin DB Error (getAllUsers):', error);
    if (data) console.log('Admin DB Data (getAllUsers):', data.length, 'users found');

    return { data: data as any[], error };
};

export const toggleUserBlock = async (userId: string, blocked: boolean) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ blocked })
        .eq('id', userId)
        .select();
    return { data, error };
};

// Monetization Functions

export const getPlans = async () => {
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });
    return { data: data as any[], error };
};

export const getUserSubscription = async (userId: string) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
    return { data, error };
};

export const getServiceHighlights = async (serviceId: string) => {
    const { data, error } = await supabase
        .from('service_highlights')
        .select('*')
        .eq('service_id', serviceId)
        .gt('ends_at', new Date().toISOString());
    return { data, error };
};

// Admin Monetization Functions

export const getAllSubscriptions = async () => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*, profiles(name, email), plans(name)')
        .order('created_at', { ascending: false });
    return { data, error };
};

export const activateSubscription = async (userId: string, planId: string, days: number = 30) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // Inactivate previous active subscriptions for this user
    await supabase
        .from('subscriptions')
        .update({ status: 'inactive' })
        .eq('user_id', userId)
        .eq('status', 'active');

    const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
            user_id: userId,
            plan_id: planId,
            status: 'active',
            expires_at: expiresAt.toISOString()
        }])
        .select()
        .single();

    return { data, error };
};

export const activateHighlight = async (serviceId: string, days: number = 7) => {
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + days);

    const { data, error } = await supabase
        .from('service_highlights')
        .insert([{
            service_id: serviceId,
            starts_at: new Date().toISOString(),
            ends_at: endsAt.toISOString()
        }])
        .select()
        .single();

    return { data, error };
};

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data: data as any, error };
};

export const updateProfile = async (userId: string, updates: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    return { data, error };
};
