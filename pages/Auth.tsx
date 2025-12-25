
import React, { useState } from 'react';
import { signIn, signUp } from '../services/supabase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('profissional@exemplo.com');
  const [password, setPassword] = useState('senha123');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, name, city);
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Hero Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center mix-blend-overlay opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0vz_eedVURIK6bNO-2amOckSJsW3D2kewFw-Va8daeZqICvBMNxTtYylO5GyD5-ncEVFAG4ubmvDP2r528GuOtGfvFj9m-dDcfgNVkXME2Po05ly39tEAG9kCK3JSwqTQHfvzsh0v4OORwFxUB_5NjnoClTQjwjqVZ3Th7cII43Kf1wOvNE8cppfjTxuus_ORlUsJDp8M2LU7-jSBJaxkh57RJ7Ke12W48uObkhRh2lSAUOET2F6mYlfXr50hkTq-66a2aC1OiD9t')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/80"></div>
        <div className="relative z-10 max-w-xl px-12 flex flex-col gap-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 bg-white rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">handshake</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Marketplace</h3>
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-[-0.033em]">Conectando você aos melhores profissionais locais.</h1>
          <p className="text-lg text-blue-100 font-medium leading-relaxed max-w-md">Encontre serviços rápidos perto de você, gerencie tarefas e cresça seu negócio.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex w-full lg:w-1/2 flex-col bg-white dark:bg-background-dark overflow-y-auto">
        <div className="lg:hidden p-6 flex items-center gap-2 text-slate-900 dark:text-white">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">handshake</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Marketplace</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-[440px] flex flex-col gap-8">
            <div className="w-full">
              <div className="flex border-b border-[#cfd9e7] dark:border-slate-700 gap-8">
                <button onClick={() => setIsLogin(true)} className={`flex flex-1 items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${isLogin ? 'border-b-primary text-slate-900 dark:text-white font-bold' : 'border-b-transparent text-[#4c6c9a] dark:text-slate-400'}`}>
                  Entrar
                </button>
                <button onClick={() => setIsLogin(false)} className={`flex flex-1 items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${!isLogin ? 'border-b-primary text-slate-900 dark:text-white font-bold' : 'border-b-transparent text-[#4c6c9a] dark:text-slate-400'}`}>
                  Cadastro
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
              <p className="text-[#4c6c9a] dark:text-slate-400 text-sm">Preencha seus dados para {isLogin ? 'acessar sua conta' : 'começar agora'}.</p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <label className="flex flex-col flex-1">
                    <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Nome Completo</p>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-12 px-4 text-base transition-all"
                      placeholder="Seu Nome"
                      type="text"
                      required
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Cidade</p>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-12 px-4 text-base transition-all"
                      placeholder="São Paulo, SP"
                      type="text"
                      required
                    />
                  </label>
                </>
              )}

              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Email</p>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-12 pl-12 pr-4 text-base transition-all"
                    placeholder="seu@email.com"
                    type="email"
                    required
                  />
                </div>
              </label>
              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Senha</p>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-12 pl-12 pr-12 text-base transition-all"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>
              </label>
              <button type="submit" disabled={loading} className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-all shadow-md mt-2 disabled:opacity-70">
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
