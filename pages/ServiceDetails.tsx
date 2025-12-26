
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getService } from '../services/supabase';
import { User, Service } from '../types';

interface ServiceDetailsProps {
  user: User | null;
  onLogout: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ user, onLogout }) => {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getService(id).then(({ data }) => {
        setService(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="flex justify-center py-20 text-slate-500">Carregando detalhes...</div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold">Serviço não encontrado</h2>
          <Link to="/" className="text-primary mt-4 underline">Voltar para início</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span>Serviço</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 text-slate-900 dark:text-white">{service.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>star</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">5.0</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">(Novo)</span>
                </div>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span>
                  <span>{service.city || 'Localização não informada'}</span>
                </div>
              </div>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
              {service.image_url ? (
                <img src={service.image_url} className="w-full h-full object-cover" alt={service.title} />
              ) : (
                <span className="material-symbols-outlined text-6xl text-slate-400">handyman</span>
              )}
            </div>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sobre o serviço</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">{service.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <div>
                    <h4 className="font-semibold text-sm">Disponibilidade</h4>
                    <p className="text-sm text-slate-500">A combinar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <div>
                    <h4 className="font-semibold text-sm">Garantia</h4>
                    <p className="text-sm text-slate-500">Garantia pelo prestador</p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            <section>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Conheça o Profissional</h3>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden border-2 border-white dark:border-slate-900 shadow-md">
                    <img src={`https://ui-avatars.com/api/?name=${service.profiles?.name || 'User'}&background=random`} alt="Avatar" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white dark:border-slate-900 w-5 h-5 rounded-full"></div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                      {service.profiles?.name || 'Prestador Oculto'}
                      <span className="material-symbols-outlined text-blue-500 fill" style={{ fontSize: '20px' }}>verified</span>
                    </h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Profissional cadastrado na plataforma.</p>
                  <div className="flex items-center justify-center sm:justify-start gap-6 text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">Novo</span>
                      <span className="text-slate-500">Na plataforma</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Preço total estimado</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">R$ {service.price}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-slate-500" style={{ fontSize: '20px' }}>calendar_today</span>
                    <span>Disponível para agendamento</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const message = `Olá! Vi seu anúncio "${service.title}" no LocalServ e gostaria de saber mais.`;
                    const cleanPhone = service.whatsapp?.replace(/\D/g, '') || '5585989932085';
                    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-bold text-base py-3.5 px-6 rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined fill" style={{ fontSize: '22px' }}>chat</span>
                  Falar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ServiceDetails;
