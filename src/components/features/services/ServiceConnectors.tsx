import React from 'react';
import { CreditCard, Rss, RefreshCcw, Link as LinkIcon } from 'lucide-react';
import { ConnectedService } from '../../../types';

interface ServiceConnectorsProps {
  services: ConnectedService[];
  onToggle: (id: string) => void;
}

export const ServiceConnectors: React.FC<ServiceConnectorsProps> = ({ services, onToggle }) => (
  <div className="space-y-6">
    {/* Header Card */}
    <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center gap-4">
      <div className="bg-white/20 p-4 rounded-2xl">
        <RefreshCcw className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold">Synchronisation</h3>
        <p className="text-xs opacity-80">Gérez vos sources de données pour une analyse automatique.</p>
      </div>
    </div>

    {/* Services List */}
    <section className="space-y-3 pb-12">
      <h3 className="px-2 text-xs font-black text-slate-400 uppercase tracking-widest">
        Connecteurs Actifs
      </h3>
      
      {services.map(service => (
        <div 
          key={service.id} 
          className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between group shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-colors ${
              service.status === 'connected' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-slate-100 text-slate-400'
            }`}>
              {service.type === 'bank' ? <CreditCard className="w-5 h-5" /> : <Rss className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{service.name}</h4>
              <p className={`text-[10px] font-bold ${
                service.status === 'connected' ? 'text-emerald-500' : 'text-slate-400'
              }`}>
                {service.status === 'connected' ? 'CONNECTÉ • TEMPS RÉEL' : 'INACTIF'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => onToggle(service.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              service.status === 'connected'
                ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 active:scale-95'
            }`}
          >
            {service.status === 'connected' ? 'DÉCONNECTER' : 'ACTIVER'}
          </button>
        </div>
      ))}
      
      {/* Add New Service Placeholder */}
      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-2 text-center group cursor-pointer hover:border-indigo-300 transition-colors">
        <LinkIcon className="text-slate-300 group-hover:text-indigo-400 transition-colors w-6 h-6" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
          Ajouter un nouveau service
        </p>
      </div>
    </section>
  </div>
);
