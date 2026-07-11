'use client';

import React, { useState, useEffect } from 'react';

interface Aluno {
  id: number;
  nome: string;
  email: string;
  whatsapp: string; // Garantindo o WhatsApp principal
  telefone?: string; // Telefone opcional de recado
  status: string;
  dataNascimento?: string;
  cpf?: string;
  cep?: string;
  endereco?: string;
  naturalidade?: string;
  concluiuFisio?: string;
  tempoFisioterapeuta?: string;
  periodoFaculdade?: string;
  escalaSeguranca?: string;
  justificativaSeguranca?: string;
}

export default function AdminDashboard() {
  // Estados de Controle de Acesso
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  // Estado dos dados
  const [inscritos, setInscritos] = useState<Aluno[]>([]);

  // Carrega os dados e valida a sessão ao abrir a página
  useEffect(() => {
    const adminSessao = sessionStorage.getItem('admin_logado');
    if (adminSessao === 'true') {
      setLogado(true);
    }

    if (typeof window !== 'undefined') {
      const dadosSalvos = localStorage.getItem('inscritos');
      if (dadosSalvos) {
        setInscritos(JSON.parse(dadosSalvos));
      } else {
        const iniciais = [
          { id: 1, nome: 'Carlos Silva', email: 'carlos@email.com', whatsapp: '(86) 99911-2233', status: 'Pendente' }
        ];
        localStorage.setItem('inscritos', JSON.stringify(iniciais));
        setInscritos(iniciais);
      }
    }
  }, []);

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario === 'admin' && senha === '123456') {
      setLogado(true);
      sessionStorage.setItem('admin_logado', 'true');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  // Sair (Logout)
  const handleLogout = () => {
    setLogado(false);
    sessionStorage.removeItem('admin_logado');
  };

  // Alterar Status (Aprovar / Recusar)
  // Atualize a função alterarStatus para ficar assim:
  const alterarStatus = async (id: number, novoStatus: 'Aprovado' | 'Rejeitado') => {
  // 1. Acha o aluno que está sendo modificado para pegar o nome e e-mail dele
    const alunoModificado = inscritos.find((item) => item.id === id);
      const listaAtualizada = inscritos.map((item) => 
        item.id === id ? { ...item, status: novoStatus } : item
      );
      setInscritos(listaAtualizada);
      localStorage.setItem('inscritos', JSON.stringify(listaAtualizada));
      // 3. Dispara a notificação de e-mail para o aluno em segundo plano
    if (alunoModificado) {
      try {
        await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: alunoModificado.nome,
          email: alunoModificado.email, // Dispara para o e-mail cadastrado pelo aluno
          status: novoStatus
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail de atualização para o aluno:', error);
    }
  }
};
  

  // DELETAR INSCRIÇÃO (Nova Funcionalidade)
  const deletarInscrito = (id: number, nome: string) => {
    if (window.confirm(`Tem certeza de que deseja apagar permanentemente a inscrição de "${nome}"?`)) {
      const listaFiltrada = inscritos.filter((item) => item.id !== id);
      setInscritos(listaFiltrada);
      localStorage.setItem('inscritos', JSON.stringify(listaFiltrada));
    }
  };

  const totalInscritos = inscritos.length;
  const totalAprovados = inscritos.filter((i) => i.status === 'Aprovado').length;
  const totalPendentes = inscritos.filter((i) => i.status === 'Pendente').length;

  // --- TELA DE LOGIN CASO DESLOGADO ---
  if (!logado) {
    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 space-y-6">
          <div className="text-center">
            <span className="text-4xl">🔒</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Área Administrativa</h1>
            <p className="text-xs text-gray-400 mt-1">Identifique-se para acessar o painel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Usuário</label>
              <input type="text" required placeholder="Ex: admin" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-800" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Senha</label>
              <input type="password" required placeholder="••••••" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-800" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition mt-2">
              Acessar Painel
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- DASHBOARD PRINCIPAL ---
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header do Painel com botão Sair */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
            <p className="text-sm text-gray-500">Gerenciamento de inscritos em tempo real</p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-full">
              Modo Administrador
            </div>
            {/* BOTÃO SAIR */}
            <button 
              onClick={handleLogout}
              className="text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-3 py-1.5 rounded-full transition duration-200 flex items-center gap-1"
            >
              Sair 🚪
            </button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Inscritos</p>
            <p className="text-3xl font-bold mt-2 text-indigo-600">{totalInscritos}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vagas Confirmadas</p>
            <p className="text-3xl font-bold mt-2 text-emerald-600">{totalAprovados}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aguardando PIX</p>
            <p className="text-3xl font-bold mt-2 text-amber-500">{totalPendentes}</p>
          </div>
        </div>

        {/* Tabela de Inscritos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Lista de Alunos Cadastrados</h2>
          </div>
          
          <div className="overflow-x-auto">
            {inscritos.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-400">Nenhum aluno inscrito até o momento.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inscritos.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{aluno.nome}</div>
                        <div className="text-xs text-gray-400">{aluno.email}</div>
    
                        {/* Bloco de Detalhes Adicionais */}
                        <div className="text-[11px] text-gray-500 mt-2 space-y-0.5 bg-gray-50 p-2 rounded-lg max-w-xs">
                          <p><strong>CPF:</strong> {aluno.cpf || 'N/A'} | <strong>Nasc:</strong> {aluno.dataNascimento || 'N/A'}</p>
                          <p><strong>Natural:</strong> {aluno.naturalidade || 'N/A'}</p>
                          <p><strong>Endereço:</strong> {aluno.endereco || 'N/A'} (CEP: {aluno.cep || 'N/A'})</p>
                          <p><strong>Perfil:</strong> {aluno.concluiuFisio === 'sim' ? `Formado (${aluno.tempoFisioterapeuta})` : `Estudante (${aluno.periodoFaculdade})`}</p>
                          <p className="text-indigo-600 font-medium"><strong>Segurança Órtese:</strong> {aluno.escalaSeguranca || '5'}/10</p>
                          {aluno.justificativaSeguranca && <p className="italic text-gray-400 mt-1">" {aluno.justificativaSeguranca} "</p>}
                        </div>
                      </td>
                      
                      {/* Coluna Contato Ajustada */}
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        <div>📱 {aluno.whatsapp || 'N/A'}</div>
                        {aluno.telefone && <div className="text-xs text-gray-400 mt-0.5">📞 {aluno.telefone} (Recado)</div>}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          aluno.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-700' :
                          aluno.status === 'Rejeitado' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {aluno.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {aluno.status === 'Pendente' ? (
                            <>
                              <button 
                                onClick={() => alterarStatus(aluno.id, 'Aprovado')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                              >
                                Aprovar
                              </button>
                              <button 
                                onClick={() => alterarStatus(aluno.id, 'Rejeitado')}
                                className="bg-white hover:bg-gray-50 text-rose-600 border border-gray-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                              >
                                Recusar
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic mr-2">Concluído</span>
                          )}

                          {/* BOTÃO DE APAGAR (Vermelho e discreto) */}
                          <button 
                            onClick={() => deletarInscrito(aluno.id, aluno.nome)}
                            title="Excluir Inscrição"
                            className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition duration-200 text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}