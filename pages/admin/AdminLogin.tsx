
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../services/supabase';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await signIn(email, password);

            if (error) throw error;

            // Check if user is admin (this check should ideally also happen on route protection level or getProfile)
            // For now we rely on the backend RLS preventing admin actions if not admin

            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Falha ao entrar no painel administrativo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="h-12 w-12 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Acesso Administrativo</h1>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Digite suas credenciais para continuar.</p>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="admin@localserv.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verificando...' : 'Entrar no Painel'}
                            {!loading && <span className="material-symbols-outlined text-sm">login</span>}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center border-t border-slate-200 dark:border-slate-700">
                    <a href="/" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Voltar ao site principal</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
