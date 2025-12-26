
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from '../services/supabase';
import { User } from '../types';

interface AdminLayoutProps {
    children: React.ReactNode;
    user: User | null;
    title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user, title }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <Link to="/admin" className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">admin_panel_settings</span>
                        ServiLocal Admin
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/services"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/services') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined">handyman</span>
                        Serviços
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/users') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined">group</span>
                        Usuários
                    </Link>
                    <Link
                        to="/admin/reports"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/reports') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined">flag</span>
                        Denúncias
                    </Link>
                    <Link
                        to="/admin/monetization"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/monetization') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined">payments</span>
                        Monetização
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 w-full transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold text-slate-900 dark:text-white">ServiLocal Admin</span>
                    <button className="p-2 -mr-2 text-slate-500">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
                    </header>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
