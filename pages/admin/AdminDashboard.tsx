
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { User } from '../../types';
import { getAdminStats } from '../../services/supabase';

interface AdminDashboardProps {
    user: User | null;
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const [stats, setStats] = useState({
        users: 0,
        services: 0,
        activeServices: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const data = await getAdminStats();
        setStats(data);
    };

    return (
        <AdminLayout user={user} title="Visão Geral">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Usuários</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.users}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-4 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        +12% este mês
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Serviços Cadastrados</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.services}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-4 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        +5 novos hoje
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Serviços Ativos</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.activeServices}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(stats.activeServices / (stats.services || 1)) * 100}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inativos</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.services - stats.activeServices}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                            <span className="material-symbols-outlined">pause_circle</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">Aguardando ativação ou pausados</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder for Analytics Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[300px] flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Crescimento da Plataforma</h3>
                    <div className="flex-1 flex items-end gap-2 px-4 pb-4">
                        {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                                    {h} users
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2 px-4">
                        <span>Jan</span>
                        <span>Dez</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Atividade Recente</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Novo serviço cadastrado</p>
                                    <p className="text-xs text-slate-500">"Eletricista Residencial" por João Silva</p>
                                    <span className="text-xs text-slate-400 mt-1 block">Há {i * 15} minutos</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
