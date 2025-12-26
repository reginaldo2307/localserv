
import React from 'react';
import { Profile, Service } from '../types';

interface TrustBadgesProps {
    profile?: Profile;
    service?: Service;
    variant?: 'compact' | 'full';
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ profile, service, variant = 'compact' }) => {
    if (!profile) return null;

    const isProfileComplete = profile.name && profile.city && profile.phone_whatsapp && profile.bio;
    const memberSince = new Date(profile.created_at);

    // Check if active in the last 7 days
    const lastActiveDate = profile.last_active_at ? new Date(profile.last_active_at) : null;
    const isRecentlyActive = lastActiveDate && (new Date().getTime() - lastActiveDate.getTime()) < 7 * 24 * 60 * 60 * 1000;

    const badges = [
        {
            id: 'complete',
            show: isProfileComplete,
            label: 'Perfil Completo',
            icon: 'verified_user',
            color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            darkColor: 'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
        },
        {
            id: 'verified',
            show: service?.is_verified,
            label: 'Anúncio Verificado',
            icon: 'verified',
            color: 'bg-blue-50 text-blue-700 border-blue-100',
            darkColor: 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
        },
        {
            id: 'active',
            show: isRecentlyActive,
            label: 'Ativo Recentemente',
            icon: 'bolt',
            color: 'bg-amber-50 text-amber-700 border-amber-100',
            darkColor: 'dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
        }
    ];

    if (variant === 'compact') {
        return (
            <div className="flex flex-wrap gap-1.5 mt-2">
                {badges.filter(b => b.show).map(badge => (
                    <span key={badge.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color} ${badge.darkColor}`}>
                        <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                        {badge.label}
                    </span>
                ))}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                    Desde {memberSince.getMonth() + 1}/{memberSince.getFullYear()}
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {badges.filter(b => b.show).map(badge => (
                    <div key={badge.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${badge.color} ${badge.darkColor}`}>
                        <span className="material-symbols-outlined text-[18px]">{badge.icon}</span>
                        <span className="text-xs font-black uppercase tracking-wider">{badge.label}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>Usuário desde {memberSince.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
            </div>
        </div>
    );
};

export default TrustBadges;
