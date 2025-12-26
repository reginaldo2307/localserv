
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { User } from '../types';
import { enhanceDescription } from '../services/gemini';
import { createService, updateService, getService, uploadImage, getUserSubscription, getMyServices } from '../services/supabase';

interface CreateAdProps {
  user: User | null;
  onLogout: () => void;
}

const CreateAd: React.FC<CreateAdProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      loadServiceData(editId);
    }
  }, [editId]);

  const loadServiceData = async (id: string) => {
    const { data, error } = await getService(id);
    if (data && !error) {
      setTitle(data.title);
      setDescription(data.description || '');
      setPrice(data.price.toString());
      setCity(data.city || '');
      setWhatsapp(data.whatsapp || '');
      if (data.image_url) setPreviewUrl(data.image_url);
    }
    setInitialLoading(false);
  };

  const handleEnhanceDescription = async () => {
    if (!title || !description) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceDescription(title, description);
      setDescription(enhanced);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editId && user) {
      // Check ad limit
      const { data: sub } = await getUserSubscription(user.id);
      const { data: services } = await getMyServices();
      const limit = (sub as any)?.plans?.ad_limit || 3;

      if (services && services.length >= limit) {
        alert(`Você atingiu o limite de ${limit} anúncios do seu plano atual. Faça um upgrade para publicar mais!`);
        navigate('/plans');
        return;
      }
    }

    setLoading(true);

    try {
      let imageUrl = previewUrl;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const serviceData = {
        title,
        description,
        price: parseFloat(price),
        city,
        whatsapp,
        image_url: imageUrl || undefined
      };

      if (editId) {
        const { error } = await updateService(editId, serviceData);
        if (error) throw error;
        alert('Serviço atualizado com sucesso!');
      } else {
        const { error } = await createService(serviceData);
        if (error) throw error;
        alert('Serviço criado com sucesso!');
      }

      navigate('/dashboard');
    } catch (err) {
      alert('Erro ao salvar serviço');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="flex justify-center py-20 text-slate-500">Carregando dados...</div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <main className="mx-auto max-w-3xl px-4 sm:px-10 py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            {editId ? 'Editar anúncio' : 'Criar novo anúncio'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            {editId ? 'Atualize as informações do seu serviço.' : 'Preencha os dados abaixo para divulgar seu serviço.'}
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Título do anúncio</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4"
              placeholder="Ex: Reformas residenciais, Aulas de Inglês..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Descrição detalhada</label>
              <button
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isEnhancing || !title || !description}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                {isEnhancing ? 'Melhorando...' : 'Melhorar com IA'}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-[160px] p-4 text-base"
              placeholder="Descreva sua experiência e o que está incluso no serviço..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Preço estimado (R$)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4"
                placeholder="0.00"
                type="number"
                step="0.01"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Cidade</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4"
                placeholder="São Paulo, SP"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">WhatsApp para contato (com DDD)</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4"
              placeholder="Ex: 11999999999"
              required
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Foto do serviço</label>
            <div className="relative flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group overflow-hidden">
              {previewUrl ? (
                <div className="absolute inset-0 z-0 text-center">
                  <img src={previewUrl} alt="Preview" className="mx-auto h-full object-contain opacity-50 group-hover:opacity-40 transition-opacity" />
                </div>
              ) : null}
              <div className="relative z-10 space-y-1 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">
                  {previewUrl ? 'edit' : 'add_photo_alternate'}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {previewUrl ? 'Clique para alterar a foto' : 'Arraste uma foto ou clique para fazer upload'}
                </p>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pb-12 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 h-12 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="px-8 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 disabled:opacity-70">
              <span>{loading ? 'Salvando...' : (editId ? 'Atualizar serviço' : 'Publicar serviço')}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
};

export default CreateAd;
