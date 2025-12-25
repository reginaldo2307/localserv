
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getMyServices, deleteService, updateServiceStatus, getUserSubscription, getPlans } from '../services/supabase';
import { User, Service, Subscription, Plan } from '../types';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [user]);

  const loadServices = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await getMyServices();
    const { data: subData } = await getUserSubscription(user.id);
    setServices(data || []);
    setSubscription(subData as any);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      const { error } = await deleteService(id);
      if (!error) loadServices();
      else alert('Erro ao excluir');
    }
  };

  const toggleStatus = async (service: Service) => {
    const { error } = await updateServiceStatus(service.id, !service.active);
    if (!error) loadServices();
    else alert('Erro ao atualizar status');
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Gerenciar Serviços</h2>
            <p className="text-base text-slate-500 dark:text-slate-400">Visualize e gerencie seu catálogo de serviços.</p>
          </div>
          <Link to="/create" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600 transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Novo Serviço</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Serviços</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{services.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Plano Atual</p>
            <div className="flex items-center justify-between mt-2">
              <p className={`text-2xl font-bold ${subscription?.plans?.name ? 'text-primary' : 'text-slate-400'}`}>
                {subscription?.plans?.name || 'Grátis'}
              </p>
              <Link to="/plans" className="text-xs font-bold text-primary hover:underline">Mudar</Link>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Serviços Ativos</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{services.filter(s => s.active).length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Limite de Anúncios</p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {services.length} / {subscription?.plans?.ad_limit || 3}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Carregando seus serviços...</div>
          ) : services.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhum serviço encontrado. Crie o primeiro!</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Serviço</th>
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Cidade</th>
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Preço</th>
                      <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                      <th className="px-6 py-4 font-medium text-right text-slate-500 dark:text-slate-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {services.map(service => (
                      <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <span className="material-symbols-outlined">handyman</span>
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{service.title}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[200px]">{service.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{service.city}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">R$ {service.price}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleStatus(service)} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${service.active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${service.active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            {service.active ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => window.open(`https://wa.me/5511999999999?text=Quero+destacar+o+serviço:+${service.title}`, '_blank')}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">stars</span>
                              Destacar
                            </button>
                            <Link to={`/create?edit=${service.id}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </Link>
                            <button onClick={() => handleDelete(service.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800">
                {services.map(service => (
                  <div key={service.id} className="p-4">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-2xl">handyman</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{service.title}</h3>
                        <p className="text-sm text-slate-500">{service.city}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">R$ {service.price}</span>
                          <span className={`text-xs font-medium ${service.active ? 'text-emerald-600' : 'text-slate-500'}`}>{service.active ? 'Ativo' : 'Inativo'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <Link to={`/create?edit=${service.id}`} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span> Editar
                      </Link>
                      <button onClick={() => toggleStatus(service)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium">
                        {service.active ? 'Pausar' : 'Ativar'}
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium text-red-600">
                        <span className="material-symbols-outlined text-[18px]">delete</span> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
