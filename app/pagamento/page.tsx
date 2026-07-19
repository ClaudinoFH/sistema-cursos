'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Pagamento() {
  const router = useRouter();
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix');
  const [carregando, setCarregando] = useState(false);

  const handleFinalizarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // O fluxo do PIX continua exatamente igual
    if (metodo === 'pix') {
      setCarregando(true);
      router.push('/comprovante');
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-6 space-y-6 text-slate-800">
        
        <div className="bg-emerald-600 p-6 text-center text-white relative">
          <Link href="/inscricao" className="absolute left-4 top-6 text-sm opacity-80 hover:opacity-100 transition flex items-center gap-1">
            ← Voltar
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">Forma de Pagamento</h1>
          <p className="text-xs text-slate-400">Escolha como deseja pagar</p>
        </div>

        {/* Seletores de Método */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => setMetodo('pix')}
            className={`py-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-1 border ${
              metodo === 'pix' 
                ? 'border-emerald-600 bg-emerald-50/50 text-emerald-600' 
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">⚡</span>Pagar com PIX
          </button>

          <button 
            type="button"
            onClick={() => setMetodo('cartao')}
            className={`py-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-1 border ${
              metodo === 'cartao' 
                ? 'border-emerald-600 bg-emerald-50/50 text-emerald-600' 
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">💳</span>Cartão de Crédito
          </button>
        </div>

        <form onSubmit={handleFinalizarPagamento} className="space-y-4">
          {metodo === 'pix' ? (
            /* CONTEÚDO DO PIX (MANTIDO ORIGINAL) */
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center space-y-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Código Copie e Cole PIX</p>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono select-all break-all text-left text-slate-600">
                00020126580014BR.GOV.BCB.PIX013696a5698c-109b-4f00-9793-996c381bcace52040000530398654072000.005802BR5925CLAUDINO ALVES DE LIMA FI6008TERESINA62070503***63047D2C
              </div>
              <p className="text-xs text-amber-600 font-medium">👉 Após pagar, anexar o comprovante na próxima tela.</p>
              
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {carregando ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  'Já paguei, enviar comprovante'
                )}
              </button>
            </div>
          ) : (
            /* NOVA PARTE SIMPLIFICADA DO CARTÃO DE CRÉDITO */
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-5 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-3xl block">🛡️</span>
                <h3 className="font-bold text-slate-800 text-sm">Ambiente de Pagamento Seguro</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Para sua segurança e para garantir opções de parcelamento em até **12x**, o pagamento via cartão é processado diretamente na plataforma do Mercado Pago.
                </p>
              </div>

              {/* Link Direto do Checkout Pro */}
              <a 
                href="https://mpago.la/181xqxB" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Ir para o Mercado Pago 🚀
              </a>
              
              <p className="text-[10px] text-slate-400">
                Uma nova aba será aberta. Após concluir a transação por lá, você poderá retornar ao nosso sistema.
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}