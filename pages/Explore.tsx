
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getServices } from '../services/supabase';
import { User, Service } from '../types';
import TrustBadges from '../components/TrustBadges';

interface ExploreProps {
  user: User | null;
  onLogout: () => void;
}

const Explore: React.FC<ExploreProps> = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [cityFilter]);

  const loadServices = async () => {
    setLoading(true);
    const { data } = await getServices(cityFilter);
    setServices(data || []);
    setLoading(false);
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Hero Section */}
      <section className="relative w-full bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-cover bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjt_LRALImZ7CNHYzMVSnEPqkfEuHJS1C4wvblMN0f23B8tw1qypGGQczKOcl_ODDZwfS7X0aeyIxodbnzXwIKegE9SwKOMkSg4xBA43Ibqioblw4xVhjvLcwi5dblw2tBfm41G2vzjuXcOC0YXAyA3SIMFyPa1onDhn8MxdkAjYM-AGGhhuqjx32upKyV7wuO2Cyn0NjV_8A9a7w_vIEB0uds8l8dKjN0wh_-nD_HyHvTozXbPDbYxfqVB1pCkLM0vjawLOv1PObQ')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        <div className="relative z-10 px-4 py-20 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4 max-w-4xl drop-shadow-sm">
            Encontre ajuda para suas <span className="text-blue-400">tarefas locais</span>
          </h1>
          <p className="text-slate-200 text-base md:text-lg font-normal mb-10 max-w-2xl drop-shadow-sm">
            Profissionais verificados na sua vizinhança prontos para ajudar com limpeza, reparos, mudanças e muito mais.
          </p>
          <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-2 flex flex-col md:flex-row items-stretch gap-2">
            <div className="flex-1 flex items-center px-4 h-12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm md:text-base p-0"
                placeholder="O que você precisa? (ex: Eletricista)"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 h-12">
              <span className="material-symbols-outlined text-slate-400 mr-3">location_on</span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 text-sm md:text-base p-0"
                placeholder="Cidade"
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>
            <button onClick={loadServices} className="h-12 px-8 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {loading ? 'Carregando serviços...' : 'Serviços Recentes'}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Buscando oportunidades próximas...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 dark:border-slate-700">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {service.image_url ? (
                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-300">handyman</span>
                  )}
                  {service.highlighted_until && new Date(service.highlighted_until) > new Date() && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      Destaque
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Serviço</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> {service.city || 'Local'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                  <TrustBadges profile={service.profiles} service={service} variant="compact" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4 line-clamp-2">{service.description}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-slate-200 overflow-hidden">
                        {service.profiles?.name ? (
                          <img
                            src={service.profiles.avatar_url || `https://ui-avatars.com/api/?name=${service.profiles.name}&background=random`}
                            alt={service.profiles.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-xs font-bold text-slate-500">?</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-900 dark:text-white flex items-center gap-1">
                        {service.profiles?.name || 'Prestador'}
                        {(service.profiles as any)?.subscriptions?.some((s: any) => s.status === 'active' && s.plans?.has_premium_badge) && (
                          <span className="material-symbols-outlined text-amber-500 text-[14px]">verified</span>
                        )}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary">R$ {service.price}</span>
                  </div>
                  <Link to={`/service/${service.id}`} className="mt-4 w-full py-2 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium text-sm hover:bg-primary hover:text-white transition-colors">
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Explore;
