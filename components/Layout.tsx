
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, hideHeader = false }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark">
      {!hideHeader && (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]">handyman</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight group-hover:text-primary transition-colors">LocalServ</h2>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 items-center justify-end gap-8">
              <Link to="/" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">Explorar</Link>
              {user?.role === 'provider' && (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">Painel</Link>
                  <Link to="/plans" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">Planos</Link>
                  <Link to="/profile" className="text-sm font-medium text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">Perfil</Link>
                </>
              )}
              {user ? (
                <>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <button onClick={onLogout} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors">
                    <span>Sair</span>
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                  </button>
                </>
              ) : (
                <Link to="/auth" className="text-sm font-medium text-primary hover:underline">Entrar / Cadastro</Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/create" className="hidden sm:flex h-10 px-4 items-center justify-center rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-sm hover:shadow-md">
                <span className="truncate">Publicar Serviço</span>
              </Link>
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col p-4 gap-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined">explore</span>
                  Explorar Serviços
                </Link>

                {user?.role === 'provider' && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined">dashboard</span>
                      Painel do Profissional
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined">person</span>
                      Meu Perfil
                    </Link>
                    <Link
                      to="/plans"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined">stars</span>
                      Planos e Destaques
                    </Link>
                  </>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

                <Link
                  to="/create"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-primary text-white font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Publicar Serviço
                </Link>

                {user ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 font-medium transition-colors text-left"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sair da Conta
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 text-primary font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined">login</span>
                    Entrar / Criar Conta
                  </Link>
                )}
              </nav>
            </div>
          )}
        </header>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="size-6 bg-primary rounded flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]">handyman</span>
                </div>
                <span className="font-bold text-lg">LocalServ</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Conectando pessoas a profissionais locais de confiança para resolver tarefas do dia a dia com segurança e agilidade.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Plataforma</h4>
              <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm">Explorar Serviços</Link>
              <Link to="/auth" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm">Seja um Profissional</Link>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm">Central de Ajuda</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Legal</h4>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm">Termos de Uso</a>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm">Política de Privacidade</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Redes Sociais</h4>
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">share</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} LocalServ. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Feito com</span>
              <span className="material-symbols-outlined text-red-500 text-[16px] fill">favorite</span>
              <span className="text-slate-400 text-sm">para a vizinhança.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

