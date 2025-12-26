
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { User, Plan } from '../types';
import { getPlans } from '../services/supabase';

interface PlansProps {
    user: User | null;
    onLogout: () => void;
}

const Plans: React.FC<PlansProps> = ({ user, onLogout }) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            const { data } = await getPlans();
            if (data) setPlans(data);
            setLoading(false);
        };
        fetchPlans();
    }, []);

    const handleSubscribe = (plan: Plan) => {
        const message = `Olá! Tenho interesse no plano ${plan.name} do ServiLocal. Como posso realizar o pagamento?`;
        const whatsappUrl = `https://wa.me/5585989932085?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (loading) {
        return (
            <Layout user={user} onLogout={onLogout}>
                <div className="flex justify-center py-20 text-slate-500">Carregando planos...</div>
            </Layout>
        );
    }

    return (
        <Layout user={user} onLogout={onLogout}>
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h2 className="text-base font-bold text-primary uppercase tracking-wide">Preços e Planos</h2>
                    <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        Escolha o plano ideal para o seu negócio
                    </p>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                        Aumente sua visibilidade, consiga mais clientes e destaque seus serviços na nossa plataforma.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col rounded-2xl border ${plan.price > 0
                                ? 'border-primary shadow-xl shadow-blue-500/10 scale-105 z-10'
                                : 'border-slate-200 dark:border-slate-800'
                                } bg-white dark:bg-slate-900 p-8`}
                        >
                            {plan.price > 0 && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-bold text-white">
                                    MAIS POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                                <p className="mt-4 flex items-baseline text-slate-900 dark:text-white">
                                    <span className="text-5xl font-black tracking-tight">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                                    <span className="ml-1 text-xl font-semibold text-slate-500">/mês</span>
                                </p>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ideal para {plan.name === 'Grátis' ? 'quem está começando' : 'impulsionar suas vendas'}.</p>
                            </div>

                            <ul className="mb-8 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                                    <span>Até <strong>{plan.ad_limit === 999 ? 'Ilimitados' : plan.ad_limit} anúncios</strong> simultâneos</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined ${plan.has_premium_badge ? 'text-emerald-500' : 'text-slate-300'} text-[20px]`}>
                                        {plan.has_premium_badge ? 'check_circle' : 'cancel'}
                                    </span>
                                    <span className={plan.has_premium_badge ? 'text-slate-900 dark:text-white font-medium' : 'opacity-50'}>Selo de Prestador Premium</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined ${plan.priority_search ? 'text-emerald-500' : 'text-slate-300'} text-[20px]`}>
                                        {plan.priority_search ? 'check_circle' : 'cancel'}
                                    </span>
                                    <span className={plan.priority_search ? 'text-slate-900 dark:text-white font-medium' : 'opacity-50'}>Prioridade na busca</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined ${plan.price > 0 ? 'text-emerald-500' : 'text-slate-300'} text-[20px]`}>
                                        {plan.price > 0 ? 'check_circle' : 'cancel'}
                                    </span>
                                    <span className={plan.price > 0 ? 'text-slate-900 dark:text-white font-medium' : 'opacity-50'}>Suporte prioritário</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                className={`mt-auto block w-full rounded-xl px-4 py-4 text-center text-sm font-black transition-all ${plan.price > 0
                                    ? 'bg-primary text-white hover:bg-blue-600'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200'
                                    }`}
                            >
                                {plan.price === 0 ? 'Plano Atual' : 'Contratar Agora'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 rounded-3xl bg-slate-900 p-8 md:p-12 text-center text-white">
                    <h3 className="text-3xl font-black">Precisa de destaque avulso?</h3>
                    <p className="mt-4 text-slate-400 text-lg">Você também pode destacar serviços individualmente para aparecer no topo da lista por 7 dias.</p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 w-full max-w-xs">
                            <span className="text-primary font-bold">Destaque 7 dias</span>
                            <div className="text-3xl font-black my-2 text-white">R$ 9,90</div>
                            <p className="text-xs text-slate-500">Pagamento único via Pix</p>
                        </div>
                        <button
                            onClick={() => window.open('https://wa.me/5585989932085?text=Quero+destacar+meu+serviço', '_blank')}
                            className="px-8 py-4 bg-primary rounded-xl font-bold hover:bg-blue-600 transition-colors"
                        >
                            Falar com Consultor
                        </button>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Plans;
