
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { User } from '../../types';
import {
    getAllUsers,
    getAllServices,
    getPlans,
    getAllSubscriptions,
    activateSubscription,
    activateHighlight
} from '../../services/supabase';

interface AdminMonetizationProps {
    user: User | null;
    onLogout: () => void;
}

const AdminMonetization: React.FC<AdminMonetizationProps> = ({ user, onLogout }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('');
    const [subDays, setSubDays] = useState(30);

    const [selectedService, setSelectedService] = useState('');
    const [highlightDays, setHighlightDays] = useState(7);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [u, s, p, sub] = await Promise.all([
            getAllUsers(),
            getAllServices(),
            getPlans(),
            getAllSubscriptions()
        ]);
        setUsers(u.data || []);
        setServices(s.data || []);
        setPlans(p.data || []);
        setSubscriptions(sub.data || []);
        setLoading(false);
    };

    const handleActivateSub = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !selectedPlan) return;

        const { error } = await activateSubscription(selectedUser, selectedPlan, subDays);
        if (!error) {
            alert('Assinatura ativada com sucesso!');
            loadData();
        } else {
            alert('Erro ao ativar assinatura');
        }
    };

    const handleActivateHighlight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService) return;

        const { error } = await activateHighlight(selectedService, highlightDays);
        if (!error) {
            alert('Destaque ativado com sucesso!');
            loadData();
        } else {
            alert('Erro ao ativar destaque');
        }
    };

    if (loading) {
        return (
            <Layout user={user} onLogout={onLogout}>
                <div className="flex justify-center py-20 text-slate-500">Carregando painel de monetização...</div>
            </Layout>
        );
    }

    return (
        <Layout user={user} onLogout={onLogout}>
            <main className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">Admin: Monetização</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Activate Subscription */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Ativar Assinatura Manual</h2>
                        <form onSubmit={handleActivateSub} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Usuário</label>
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-10 px-3"
                                >
                                    <option value="">Selecione um usuário</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Plano</label>
                                <select
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-10 px-3"
                                >
                                    <option value="">Selecione um plano</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Duração (dias)</label>
                                <input
                                    type="number"
                                    value={subDays}
                                    onChange={(e) => setSubDays(parseInt(e.target.value))}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-10 px-3"
                                />
                            </div>
                            <button type="submit" className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                                Ativar Assinatura
                            </button>
                        </form>
                    </div>

                    {/* Activate Highlight */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Ativar Destaque Manual</h2>
                        <form onSubmit={handleActivateHighlight} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Serviço</label>
                                <select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-10 px-3"
                                >
                                    <option value="">Selecione um serviço</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.title} ({s.profiles?.name})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Duração (dias)</label>
                                <input
                                    type="number"
                                    value={highlightDays}
                                    onChange={(e) => setHighlightDays(parseInt(e.target.value))}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-10 px-3"
                                />
                            </div>
                            <button type="submit" className="w-full py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors">
                                Ativar Destaque
                            </button>
                        </form>
                    </div>
                </div>

                {/* Subscriptions List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold font-title">Assinaturas Ativas</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Usuário</th>
                                <th className="px-6 py-4 font-medium">Plano</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Expira em</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {subscriptions.map(sub => (
                                <tr key={sub.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold">{sub.profiles?.name}</div>
                                        <div className="text-xs text-slate-500">{sub.profiles?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-primary">{sub.plans?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {sub.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(sub.expires_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {subscriptions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhuma assinatura encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </Layout>
    );
};

export default AdminMonetization;
