
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, Profile as ProfileType } from '../types';
import { supabase, getProfile, updateProfile, uploadAvatar } from '../services/supabase';

interface ProfileProps {
    user: User | null;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        phone_whatsapp: '',
        bio: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await getProfile(user.id);
        if (!error && data) {
            setProfile(data);
            setFormData({
                name: data.name || '',
                city: data.city || '',
                phone_whatsapp: data.phone_whatsapp || '',
                bio: data.bio || '',
                avatar_url: data.avatar_url || ''
            });
        }
        setLoading(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !e.target.files || e.target.files.length === 0) return;

        setSaving(true);
        setMessage(null);

        try {
            const file = e.target.files[0];
            const url = await uploadAvatar(user.id, file);
            setFormData(prev => ({ ...prev, avatar_url: url }));
            setMessage({ type: 'success', text: 'Avatar carregado! Não esqueça de salvar as alterações.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Erro ao carregar avatar.' });
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Simple WhatsApp validation (basic check for numbers)
        const whatsappClean = formData.phone_whatsapp.replace(/\D/g, '');
        if (whatsappClean && whatsappClean.length < 10) {
            setMessage({ type: 'error', text: 'Por favor, insira um número de WhatsApp válido.' });
            return;
        }

        setSaving(true);
        setMessage(null);

        const { error } = await updateProfile(user.id, {
            name: formData.name,
            city: formData.city,
            phone_whatsapp: formData.phone_whatsapp,
            bio: formData.bio.substring(0, 160), // Limit bio size
            avatar_url: formData.avatar_url
        });

        if (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar alterações.' });
        } else {
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
            setEditMode(false);
            loadProfile();
        }
        setSaving(false);
    };

    const isProfileComplete = profile?.name && profile?.city && profile?.phone_whatsapp && profile?.bio;

    if (loading) {
        return (
            <Layout user={user} onLogout={onLogout}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout user={user} onLogout={onLogout}>
            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Nudge Banner */}
                {!isProfileComplete && !editMode && (
                    <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex items-center gap-4 animate-pulse">
                        <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-full text-amber-600 dark:text-amber-400">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-amber-900 dark:text-amber-100">Complete seu perfil</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300">Perfis completos passam mais confiança e convertem 3x mais!</p>
                        </div>
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            Completar Agora
                        </button>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    {/* Cover/Header area */}
                    <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="relative group">
                                <img
                                    src={formData.avatar_url || profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.name}&background=random`}
                                    alt={profile?.name}
                                    className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 object-cover shadow-lg"
                                />
                                {editMode && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="material-symbols-outlined text-white">add_a_photo</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{profile?.name || 'Usuário'}</h1>
                                <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    {profile?.city || 'Cidade não informada'}
                                </p>
                            </div>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Editar Perfil
                                </button>
                            )}
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                                {message.text}
                            </div>
                        )}

                        {editMode ? (
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome Completo</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Cidade</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="Ex: Fortaleza, CE"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">WhatsApp (com DDD)</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                            value={formData.phone_whatsapp}
                                            onChange={(e) => setFormData({ ...formData, phone_whatsapp: e.target.value })}
                                            placeholder="Ex: 85999999999"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Bio / Descrição Curta (Max 160 caracteres)</label>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white min-h-[100px] resize-none"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value.substring(0, 160) })}
                                        placeholder="Conte um pouco sobre você ou sua especialidade..."
                                    />
                                    <p className="text-xs text-right text-slate-400">{formData.bio.length}/160</p>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="px-6 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Dados de Contato</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold">E-mail</p>
                                                <p className="text-slate-900 dark:text-white font-medium">{profile?.email}</p>
                                            </div>
                                        </div>
                                        {profile?.phone_whatsapp && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                                    <span className="material-symbols-outlined text-[20px]">phone</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-bold">WhatsApp</p>
                                                    <p className="text-slate-900 dark:text-white font-medium">{profile?.phone_whatsapp}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Sobre</h3>
                                        <p className="text-slate-600 dark:text-slate-300 italic">
                                            {profile?.bio || 'Nenhuma bio informada ainda.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Informações da Conta</h3>
                                    <p className="text-sm text-slate-500">Membro desde: {new Date(profile?.created_at || '').toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Profile;
