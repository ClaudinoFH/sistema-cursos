'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script'; // ← Importação nativa do Next.js para carregar scripts externos

// Avisa ao TypeScript que a variável 'MercadoPago' vai existir de forma global no navegador
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface ParcelaOpcao {
  quantidade: number;
  textoExibicao: string;
}

export default function Pagamento() {
  const router = useRouter();
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix');
  const [carregando, setCarregando] = useState(false);
  
  // Estados do Mercado Pago e Parcelamento
  const [mpInstance, setMpInstance] = useState<any>(null);
  const [mostrarParcelas, setMostrarParcelas] = useState(false);
  const [opcoesParcelas, setOpcoesParcelas] = useState<ParcelaOpcao[]>([]);
  const [parcelaSelecionada, setParcelaSelecionada] = useState('');

  // Estados do formulário de cartão
  const [cartaoData, setCartaoData] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });

  // Função disparada assim que o script do Mercado Pago termina de carregar na tela
  const inicializarMercadoPago = () => {
    if (window.MercadoPago) {
      // Inicializa o front-end com sua chave pública (pode usar essa de teste por enquanto)
      const mp = new window.MercadoPago('APP_USR-3622792744391755-071109-79c3f088b06453bd928d25552f2e21b9-3535715248', {
        locale: 'pt-BR'
      });
      setMpInstance(mp);
    }
  };

  // Escuta o número do cartão e calcula os juros em tempo real no Mercado Pago
  const handleNumeroCartaoChange = async (numeroDigitado: string) => {
    setCartaoData({ ...cartaoData, numero: numeroDigitado });
    
    const bin = numeroDigitado.replace(/\s/g, '').slice(0, 6);

    if (bin.length === 6 && mpInstance) {
      try {
        // Chamada oficial ao SDK do Mercado Pago
        const resposta = await mpInstance.getInstallments({
          amount: 350.00, // Valor do investimento
          bin: bin
        });

        if (resposta && resposta[0] && resposta[0].payer_costs) {
          const parcelasCalculadas = resposta[0].payer_costs.map((custo: any) => ({
            quantidade: custo.installments,
            textoExibicao: custo.recommended_message // O próprio MP devolve o texto com os juros calculados!
          }));

          setOpcoesParcelas(parcelasCalculadas);
          setMostrarParcelas(true);
        }
      } catch (erro) {
        console.error("Erro ao buscar juros do cartão no Mercado Pago:", erro);
      }
    } else if (bin.length < 6) {
      setMostrarParcelas(false);
    }
  };

  const handleFinalizarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    if (metodo === 'pix') {
      setCarregando(false);
      router.push('/comprovante');
    } else {
      try {
        const dadosLocais = localStorage.getItem('inscritos');
        const inscritos = dadosLocais ? JSON.parse(dadosLocais) : [];
        const ultimoInscrito = inscritos[inscritos.length - 1] || {};

        const resposta = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: cartaoData.nome,
            email: ultimoInscrito.email || 'email@teste.com',
            numeroCartao: cartaoData.numero,
            validade: cartaoData.validade,
            cvv: cartaoData.cvv,
            installments: Number(parcelaSelecionada),
            alunoId: ultimoInscrito.id
          }),
        });

        const dadosPreenchidos = await resposta.json();

        if (dadosPreenchidos.success && dadosPreenchidos.status === 'approved') {
          if (ultimoInscrito.id) {
            const listaAtualizada = inscritos.map((item: any) => 
              item.id === ultimoInscrito.id ? { ...item, status: 'Aprovado' } : item
            );
            localStorage.setItem('inscritos', JSON.stringify(listaAtualizada));
            
            await fetch('/api/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nome: ultimoInscrito.nome,
                email: ultimoInscrito.email,
                status: 'Aprovado'
              }),
            });
          }

          alert('🎉 Pagamento aprovado via Mercado Pago! Sua vaga está confirmada e seu e-mail de acesso já foi enviado.');
          window.location.href = '/';
        } else {
          alert(`❌ Cartão recusado: ${dadosPreenchidos.detail || 'Verifique os dados e tente novamente.'}`);
        }
      } catch (erro) {
        console.error(erro);
        alert('Erro ao conectar com o servidor de pagamento.');
      } finally {
        setCarregando(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      {/* Carrega o Script Oficial do Mercado Pago de forma assíncrona por trás dos panos */}
      <Script 
        src="https://sdk.mercadopago.com/js/v2" 
        onLoad={inicializarMercadoPago}
      />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-6 space-y-6 text-slate-800">
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-slate-900">Forma de Pagamento</h1>
          <p className="text-xs text-slate-400">Escolha como deseja pagar o investimento de R$ 350,00</p>
        </div>

        {/* Seletores de Método */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => setMetodo('pix')}
            className={`py-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-1 border ${
              metodo === 'pix' 
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' 
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
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' 
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">💳</span>Cartão de Crédito
          </button>
        </div>

        <form onSubmit={handleFinalizarPagamento} className="space-y-4">
          {metodo === 'pix' ? (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center space-y-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Código Copie e Cole PIX</p>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono select-all break-all text-left text-slate-600">
                00020101021126580014br.gov.bcb.pix0136suachavepixaqui05030005204000053039865405350.005802BR5913NomeDoCurso6008Teresina62070503***6304ABCD
              </div>
              <p className="text-xs text-amber-600 font-medium">👉 Após pagar, anexar o comprovante na próxima tela.</p>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nome impresso no cartão</label>
                <input type="text" required placeholder="EX: CLAUDSON S SILVA" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm uppercase focus:ring-2 focus:ring-indigo-500 text-slate-800" value={cartaoData.nome} onChange={e => setCartaoData({...cartaoData, nome: e.target.value})} />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Número do Cartão</label>
                <input 
                  type="text" 
                  required
                  placeholder="0000 0000 0000 0000" 
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  value={cartaoData.numero}
                  onChange={e => handleNumeroCartaoChange(e.target.value)}
                />
              </div>

              {/* CAMPO DE PARCELAS DINÂMICO REAL */}
              {mostrarParcelas && (
                <div className="animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Opções de Parcelamento</label>
                  <select 
                    required
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                    value={parcelaSelecionada}
                    onChange={e => setParcelaSelecionada(e.target.value)}
                  >
                    <option value="">Selecione o parcelamento...</option>
                    {opcoesParcelas.map((parc) => (
                      <option key={parc.quantidade} value={parc.quantidade}>
                        {parc.textoExibicao}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Validade</label>
                  <input type="text" required maxLength={5} placeholder="MM/AA" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-center focus:ring-2 focus:ring-indigo-500 text-slate-800" value={cartaoData.validade} onChange={e => setCartaoData({...cartaoData, validade: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">CVV</label>
                  <input type="password" required maxLength={4} placeholder="123" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-center focus:ring-2 focus:ring-indigo-500 text-slate-800" value={cartaoData.cvv} onChange={e => setCartaoData({...cartaoData, cvv: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {carregando ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : metodo === 'pix' ? (
              'Já paguei, enviar comprovante'
            ) : (
              'Confirmar e Pagar R$ 350,00'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}