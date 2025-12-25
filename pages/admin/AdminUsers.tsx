
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { User, Profile } from '../../types';
import { getAllUsers, toggleUserBlock } from '../../services/supabase';

interface AdminUsersProps {
    user: User | null;
    onLogout: () => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ user, onLogout }) => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await getAllUsers();
        if (error) {
            console.error('Error loading users:', error);
            setError(error.message);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    const handleToggleBlock = async (profile: Profile) => {
        if (profile.is_admin) {
            alert("Não é possível bloquear um administrador.");
            return;
        }
        const { error } = await toggleUserBlock(profile.id, !profile.blocked);
        if (!error) loadUsers();
        else alert('Erro ao atualizar status do usuário.');
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout user={user} title="Gestão de Usuários">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou cidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400">Total: {users.length} | Filtrados: {filteredUsers.length}</span>
                        <div className="flex gap-2">
                            <button onClick={loadUsers} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <span className="material-symbols-outlined">refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500">Carregando usuários...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500">
                        <p>Erro ao carregar usuários:</p>
                        <p className="text-sm opacity-70">{error}</p>
                        <button onClick={loadUsers} className="mt-4 text-blue-500 underline">Tentar novamente</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Usuário</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Cidade</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Cadastro</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Tipo</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="px-6 py-4 font-medium text-right text-slate-500 dark:text-slate-400">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                                                    <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} alt={u.name} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-slate-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.city || '-'}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {new Date(u.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.is_admin ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                                                    Usuário
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${u.blocked
                                                ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${u.blocked ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                                {u.blocked ? 'Bloqueado' : 'Ativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!u.is_admin && (
                                                <button
                                                    onClick={() => handleToggleBlock(u)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${u.blocked
                                                        ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                                        : 'border-red-200 text-red-600 hover:bg-red-50'
                                                        }`}
                                                >
                                                    {u.blocked ? 'Desbloquear' : 'Bloquear'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
