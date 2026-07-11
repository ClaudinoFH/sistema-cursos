'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Inscricao() {
  const router = useRouter();
  
  // Estado centralizado com todos os campos do seu projeto real
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    cep: '',
    endereco: '',
    email: '',
    telefone: '',
    naturalidade: '',
    concluiuFisio: '', // 'sim' ou 'nao'
    tempoFisioterapeuta: '', // para quem marcou sim
    periodoFaculdade: '', // para quem marcou nao
    escalaSeguranca: '5', // padrão no meio da escala
    justificativaSeguranca: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Salva no localStorage mantendo o mesmo fluxo que criamos
    const inscritosAtuais = JSON.parse(localStorage.getItem('inscritos') || '[]');
    
    const novoInscrito = {
      id: Date.now(),
      ...formData,
      status: 'Pendente'
    };

    inscritosAtuais.push(novoInscrito);
    localStorage.setItem('inscritos', JSON.stringify(inscritosAtuais));

    // Avança para o pagamento
    router.push('/pagamento');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header do Card */}
        <div className="bg-indigo-600 p-6 text-center text-white relative">
          <Link href="/" className="absolute left-4 top-6 text-sm opacity-80 hover:opacity-100 transition flex items-center gap-1">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold mt-2">Formulário de Inscrição</h1>
          <p className="text-xs opacity-90 mt-1">Preencha seus dados profissionais abaixo</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-gray-800">
          
          {/* Seção 1: Dados Pessoais */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-bold text-sm text-indigo-600 uppercase tracking-wider mb-3">1. Dados Pessoais</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo</label>
                <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Data de Nascimento</label>
                  <input type="date" required className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CPF</label>
                  <input type="text" required placeholder="000.000.000-00" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                </div>
              </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" required placeholder="seu.email@exemplo.com" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone (Celular)</label>
                  <input type="tel" placeholder="(86) 9 9967-8338" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Naturalidade (Cidade/Estado onde nasceu)</label>
                <input type="text" required placeholder="Ex: Teresina - PI" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.naturalidade} onChange={e => setFormData({...formData, naturalidade: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Seção 2: Endereço */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-bold text-sm text-indigo-600 uppercase tracking-wider mb-3">2. Endereço</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">CEP</label>
                <input type="text" required placeholder="64000-000" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Endereço Completo (Rua, Nº, Bairro, Cidade)</label>
                <input type="text" required placeholder="Rua Exemplo, 123 - Centro" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Seção 3: Perfil Profissional (DINÂMICO) */}
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-bold text-sm text-indigo-600 uppercase tracking-wider mb-3">3. Perfil Profissional</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Já concluiu o curso de Fisioterapia?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="concluiuFisio" value="sim" required checked={formData.concluiuFisio === 'sim'} onChange={e => setFormData({...formData, concluiuFisio: e.target.value, periodoFaculdade: ''})} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                    Sim, sou formado.
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="concluiuFisio" value="nao" required checked={formData.concluiuFisio === 'nao'} onChange={e => setFormData({...formData, concluiuFisio: e.target.value, tempoFisioterapeuta: ''})} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                    Não, ainda sou estudante.
                  </label>
                </div>
              </div>

              {/* Condicional: SE marcou SIM */}
              {formData.concluiuFisio === 'sim' && (
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl animate-fadeIn">
                  <label className="block text-xs font-semibold text-indigo-900 mb-1">Há quanto tempo é fisioterapeuta?</label>
                  <input type="text" required placeholder="Ex: 3 anos" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500" value={formData.tempoFisioterapeuta} onChange={e => setFormData({...formData, tempoFisioterapeuta: e.target.value})} />
                </div>
              )}

              {/* Condicional: SE marcou NÃO */}
              {formData.concluiuFisio === 'nao' && (
                <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-xl animate-fadeIn">
                  <label className="block text-xs font-semibold text-amber-900 mb-1">Qual período está cursando?</label>
                  <input type="text" required placeholder="Ex: 7º período" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-amber-500" value={formData.periodoFaculdade} onChange={e => setFormData({...formData, periodoFaculdade: e.target.value})} />
                </div>
              )}
            </div>
          </div>

          {/* Seção 4: Nível de Conhecimento */}
          <div>
            <h3 className="font-bold text-sm text-indigo-600 uppercase tracking-wider mb-2">4. Autoavaliação</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Em uma escala de 1 a 10, o quanto você se sente seguro para prescrever uma órtese? 
                  (<span className="font-bold text-indigo-600 text-sm">{formData.escalaSeguranca}</span>/10)
                </label>
                <input type="range" min="1" max="10" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2" value={formData.escalaSeguranca} onChange={e => setFormData({...formData, escalaSeguranca: e.target.value})} />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-1 mt-1">
                  <span>1 (Inseguro)</span>
                  <span>5</span>
                  <span>10 (Totalmente Seguro)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Caso queira, justifique para que eu possa entender melhor suas dúvidas (Opcional)</label>
                <textarea rows={3} placeholder="Conte-me um pouco sobre suas maiores dificuldades..." className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" value={formData.justificativaSeguranca} onChange={e => setFormData({...formData, justificativaSeguranca: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md mt-4">
            Avançar para o Pagamento
          </button>
        </form>

      </div>
    </main>
  );
}