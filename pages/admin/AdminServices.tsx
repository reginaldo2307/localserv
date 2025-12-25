
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { User, Service } from '../../types';
import { getAllServices, deleteService, updateServiceStatus } from '../../services/supabase';

interface AdminServicesProps {
    user: User | null;
    onLogout: () => void;
}

const AdminServices: React.FC<AdminServicesProps> = ({ user, onLogout }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        const { data } = await getAllServices();
        setServices(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço permanentemente?')) {
            const { error } = await deleteService(id);
            if (!error) loadServices();
            else alert('Erro ao excluir serviço.');
        }
    };

    const handleToggleStatus = async (service: Service) => {
        const { error } = await updateServiceStatus(service.id, !service.active);
        if (!error) loadServices();
        else alert('Erro ao atualizar status.');
    };

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout user={user} title="Gestão de Serviços">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar serviço, prestador ou cidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={loadServices} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">refresh</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500">Carregando serviços...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Serviço</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Prestador</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Cidade</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                                    <th className="px-6 py-4 font-medium text-right text-slate-500 dark:text-slate-400">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredServices.map(service => (
                                    <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                    {service.image_url ? (
                                                        <img src={service.image_url} className="h-full w-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                            <span className="material-symbols-outlined text-lg">handyman</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{service.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {service.profiles?.name || 'Desconhecido'}
                                            <div className="text-xs text-slate-400">{service.profiles?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{service.city}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(service)}
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${service.active
                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                                                        : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                    }`}
                                            >
                                                {service.active ? 'Ativo' : 'Inativo'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/service/${service.id}`} target="_blank" className="p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors" title="Ver detalhes">
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                </Link>
                                                <button onClick={() => handleDelete(service.id)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors" title="Excluir">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
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

export default AdminServices;
