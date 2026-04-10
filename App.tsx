
import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, Search, Settings, AlertTriangle, 
  Info, XCircle, Camera, RefreshCcw, 
  ChevronRight, CreditCard, Rss, Link as LinkIcon, 
  CheckCircle2, UtensilsCrossed, Calendar, Leaf, 
  PiggyBank, Receipt, ArrowRight, Sparkles, Lock,
  History, Wallet, TrendingUp, Bell, ChefHat, Timer,
  ArrowDownWideNarrow
} from 'lucide-react';
import { GeminiService } from './services/geminiService';
import { OFFICIAL_RECALLS, RECEIPT_EXAMPLES } from './constants';
import { SafeScanResponse, AppSettings, ConnectedService, OptionFaitMaison } from './types';

const App: React.FC = () => {
  const [receiptText, setReceiptText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isNfcScanning, setIsNfcScanning] = useState(false);
  const [result, setResult] = useState<SafeScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>({ 
    detectSugars: true, 
    autoSyncBank: true,
    subscriptionActive: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showBilanDetails, setShowBilanDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'alerts' | 'services'>('scan');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<OptionFaitMaison | null>(null);

  const geminiService = useMemo(() => new GeminiService(), []);

  const [connectedServices, setConnectedServices] = useState<ConnectedService[]>([
    { id: '1', name: 'Ma Banque (Société Générale)', status: 'connected', type: 'bank' },
    { id: '2', name: 'NFC Carrefour / Leclerc', status: 'disconnected', type: 'nfc' },
  ]);

  const filteredRecalls = useMemo(() => {
    return [...OFFICIAL_RECALLS]
      .filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm]);

  const handleAnalyze = async (textToAnalyze: string = receiptText) => {
    if (!textToAnalyze.trim()) {
      setError("Veuillez saisir le texte d'un ticket.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await geminiService.analyzeReceipt(textToAnalyze, OFFICIAL_RECALLS, settings);
      setResult(data);
    } catch (err) {
      setError("Erreur lors de l'analyse.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateNfcPayment = () => {
    setIsNfcScanning(true);
    setTimeout(() => {
      const randomReceipt = RECEIPT_EXAMPLES[Math.floor(Math.random() * RECEIPT_EXAMPLES.length)];
      setReceiptText(randomReceipt);
      setIsNfcScanning(false);
      handleAnalyze(randomReceipt);
    }, 2000);
  };

  const toggleService = (id: string) => {
    setConnectedServices(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'connected' ? 'disconnected' : 'connected' } : s
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SafeScan</h1>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                <Lock className="w-2.5 h-2.5" /> Sécurité Chiffrée
              </div>
            </div>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        
        {/* VIEW: SCANNER */}
        {activeTab === 'scan' && (
          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3">
              <button 
                onClick={simulateNfcPayment}
                disabled={isNfcScanning}
                className="relative flex flex-col items-center gap-3 p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 overflow-hidden"
              >
                <Rss className={`w-8 h-8 ${isNfcScanning ? 'animate-pulse' : ''}`} />
                <span className="font-bold text-sm">Payer & Scanner</span>
                {isNfcScanning && <div className="absolute inset-0 bg-indigo-700/80 flex items-center justify-center animate-in fade-in"><RefreshCcw className="animate-spin" /></div>}
              </button>
              <button className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-200 rounded-3xl text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <Camera className="w-8 h-8 text-slate-400" />
                <span className="font-bold text-sm">Photo Ticket</span>
              </button>
            </section>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <textarea
                  className="w-full h-24 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono mb-3"
                  placeholder="Collez le texte de votre ticket ici..."
                  value={receiptText}
                  onChange={(e) => setReceiptText(e.target.value)}
                />
                <button onClick={() => handleAnalyze()} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Analyser manuel
                </button>
            </div>

            {isAnalyzing && (
              <div className="py-12 flex flex-col items-center gap-4 animate-in fade-in">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-slate-400">Intelligence SafeScan en cours...</p>
              </div>
            )}

            {result && !isAnalyzing && (
              <div className="space-y-6 pb-12 animate-in slide-in-from-bottom-6 duration-500">
                
                {/* Bilan Banner (Interactive) */}
                <div 
                  onClick={() => setShowBilanDetails(!showBilanDetails)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-2xl"><PiggyBank className="w-8 h-8" /></div>
                    <div>
                      <h3 className="text-sm font-bold opacity-80">Bilan d'optimisation</h3>
                      <p className="text-2xl font-black">+{result.bilan_economique}</p>
                    </div>
                  </div>
                  {showBilanDetails ? <ChevronRight className="rotate-90" /> : <ChevronRight />}
                </div>

                {/* Bilan Details (Dropdown) */}
                {showBilanDetails && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 animate-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" /> Détail du gain
                    </h4>
                    {result.details_economies.map((det, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-bold text-slate-600">{det.source}</span>
                        <span className="text-sm font-black text-emerald-600">{det.montant}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-slate-400 italic px-1">
                      * Ce montant représente les économies réalisées via l'anti-gaspillage, les remboursments et les alternatives DIY.
                    </p>
                  </div>
                )}

                {/* Security Section */}
                <section className="space-y-3">
                  <h4 className="px-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Sécurité
                  </h4>
                  {result.alerte_sanitaire.statut === 'CRITIQUE' ? (
                    <div className="bg-white border-2 border-red-200 rounded-3xl overflow-hidden shadow-sm">
                      <div className="bg-red-500 text-white p-4 flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 animate-bounce" />
                        <div>
                          <p className="font-bold">ALERTE CRITIQUE : {result.alerte_sanitaire.produit}</p>
                          <p className="text-xs opacity-90">Lot {result.alerte_sanitaire.lot_detecte} identifié</p>
                        </div>
                      </div>
                      <div className="p-5 space-y-4">
                        <p className="text-sm text-slate-600">{result.alerte_sanitaire.motif}</p>
                        <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100">
                          Générer le dossier de remboursement
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 text-emerald-600">
                      <CheckCircle2 className="w-6 h-6" />
                      <p className="text-sm font-bold">Aucun risque immédiat identifié.</p>
                    </div>
                  )}
                </section>

                {/* Anti-Gaspi Section */}
                <section className="space-y-3">
                  <h4 className="px-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Frigo Intelligent
                  </h4>
                  <div className="grid gap-3">
                    {result.gestion_frigo.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{item.article}</p>
                          <p className="text-xs text-slate-500">{item.conseil}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black block mb-1">
                            {item.conso_avant}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">Valeur: {item.valeur_estimee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Nutrition Coach Section */}
                <section className="space-y-3">
                  <h4 className="px-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Leaf className="w-4 h-4" /> Smart Swaps
                  </h4>
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 bg-amber-50/50 border-b border-slate-100">
                      <h5 className="font-bold text-amber-800">{result.optimisation_sante.produit_analyse}</h5>
                      <p className="text-xs text-amber-600 font-bold">{result.optimisation_sante.alerte_ingredient}</p>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0 font-bold text-xs shadow-sm">M</div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Option magasin plus saine</p>
                          <p className="text-sm font-bold text-slate-800">{result.optimisation_sante.alternative_magasin}</p>
                        </div>
                      </div>
                      
                      {/* DIY Card: Interactive */}
                      <div 
                        onClick={() => setSelectedRecipe(result.optimisation_sante.option_fait_maison)}
                        className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer group active:scale-95"
                      >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shrink-0 font-bold text-xs shadow-md group-hover:scale-110 transition-transform">DIY</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Recette Minute</p>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <p className="text-sm text-slate-700 italic font-medium mb-2 leading-snug">"{result.optimisation_sante.option_fait_maison.recette}"</p>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-black text-emerald-700 bg-white/50 px-2 py-0.5 rounded-lg border border-emerald-100 shadow-sm">Économie : {result.optimisation_sante.option_fait_maison.economie_estimee}</p>
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              Voir la recette <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* VIEW: ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher une marque ou un produit..." 
                className="bg-transparent border-none outline-none w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-3 pb-12">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  Base RappelConso Officielle
                </h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  <ArrowDownWideNarrow className="w-3 h-3" /> Tri: Récent
                </div>
              </div>
              {filteredRecalls.map(recall => (
                <div key={recall.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-amber-200 transition-colors">
                  <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 leading-tight">{recall.name}</h4>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold whitespace-nowrap ml-2">{recall.date}</span>
                    </div>
                    <p className="text-xs text-indigo-600 font-bold mb-2">{recall.brand}</p>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{recall.reason}</p>
                    {recall.lot && (
                      <span className="text-[10px] font-mono bg-slate-100 p-1 px-2 rounded border border-slate-200 font-bold">LOT: {recall.lot}</span>
                    )}
                  </div>
                </div>
              ))}
              {filteredRecalls.length === 0 && (
                <div className="py-12 text-center text-slate-400 font-bold italic">Aucun rappel correspondant à votre recherche.</div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl"><RefreshCcw className="w-8 h-8" /></div>
              <div>
                <h3 className="text-lg font-bold">Synchronisation</h3>
                <p className="text-xs opacity-80">Gérez vos sources de données pour une analyse automatique.</p>
              </div>
            </div>

            <section className="space-y-3 pb-12">
              <h3 className="px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Connecteurs Actifs</h3>
              {connectedServices.map(service => (
                <div key={service.id} className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between group shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors ${service.status === 'connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {service.type === 'bank' ? <CreditCard /> : <Rss />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{service.name}</h4>
                      <p className={`text-[10px] font-bold ${service.status === 'connected' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {service.status === 'connected' ? 'CONNECTÉ • TEMPS RÉEL' : 'INACTIF'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleService(service.id)}
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
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-2 text-center group cursor-pointer hover:border-indigo-300 transition-colors">
                <LinkIcon className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Ajouter un nouveau service</p>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* RECIPE MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20">
            {/* Modal Header */}
            <div className="p-8 pb-4 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-600">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 leading-tight">Recette Fait-Maison</h3>
              </div>
              <p className="text-lg font-bold text-slate-500 italic mb-2">"{selectedRecipe.recette}"</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
                  <PiggyBank className="w-3.5 h-3.5" /> Économie: {selectedRecipe.economie_estimee}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm">
                  <Timer className="w-3.5 h-3.5" /> Rapide & Sain
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors shadow-sm active:scale-90"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6">
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                  {selectedRecipe.recette_complete}
                </div>
              </div>
              
              <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-700 transition-all">
                <div>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Prêt à essayer ?</p>
                  <p className="font-bold">Ajouter les ingrédients manquants</p>
                </div>
                <div className="bg-white/20 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Recommandation locale SafeScan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation (Sticky) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 flex justify-around items-center z-50">
        <button 
          onClick={() => setActiveTab('scan')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'scan' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Scan</span>
        </button>
        <button 
          onClick={() => setActiveTab('alerts')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'alerts' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <Bell className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Alertes</span>
        </button>
        <button 
          onClick={() => setActiveTab('services')} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'services' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Portefeuille</span>
        </button>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-20 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">Réglages</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><XCircle /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><Sparkles className="w-5 h-5" /></div>
                  <span className="font-bold text-slate-700">Abonnement Anti-Gaspi</span>
                </div>
                <span className="text-emerald-600 font-black text-xs uppercase bg-white px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">ACTIF</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Leaf className="w-5 h-5" /></div>
                  <span className="font-bold text-slate-700">Analyse Sucre/Additifs</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.detectSugars} 
                  onChange={(e) => setSettings({...settings, detectSugars: e.target.checked})}
                  className="w-5 h-5 accent-indigo-600 rounded" 
                />
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-2xl text-[11px] text-indigo-800 leading-relaxed border border-indigo-100">
                <strong>POLITIQUE RGPD :</strong> Vos données bancaires sont chiffrées de bout en bout. SafeScan utilise l'intelligence artificielle Gemini pour analyser vos tickets sans jamais stocker votre identité réelle sur ses serveurs de traitement.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
