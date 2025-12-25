
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { User } from '../../types';

interface AdminReportsProps {
    user: User | null;
    onLogout: () => void;
}

const AdminReports: React.FC<AdminReportsProps> = ({ user, onLogout }) => {
    return (
        <AdminLayout user={user} title="Denúncias">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-slate-400">flag</span>
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhuma denúncia pendente</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Ótimo trabalho! A comunidade está segura.</p>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
