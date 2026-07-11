'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Comprovante() {
  const router = useRouter();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) {
      alert('Por favor, selecione um arquivo de comprovante primeiro.');
      return;
    }

    setEnviando(true);

    // 1. Coleta os dados do último aluno inscrito no localStorage
  const inscritosAtuais = JSON.parse(localStorage.getItem('inscritos') || '[]');
  const ultimoInscrito = inscritosAtuais[inscritosAtuais.length - 1];

  // 2. Função nativa do navegador para converter o arquivo em Base64
  const reader = new FileReader();
  reader.readAsDataURL(arquivo);
  
  reader.onloadend = async () => {
    const base64String = reader.result as string;
    // Remove o cabeçalho do Base64 (ex: "data:image/png;base64,") para enviar apenas o conteúdo puro
    const base64Puro = base64String.split(',')[1];

    try {
      if (ultimoInscrito) {
        // 3. Dispara a requisição enviando os dados + o arquivo em formato de texto
        await fetch('/api/notificacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...ultimoInscrito,            
            nomeArquivo: 'Comprovante de Pagamento', // Nome original (ex: comprovante.pdf)
            tipoArquivo: arquivo.type,
            arquivoBase64: base64Puro  // O arquivo convertido
           
          }),
        });
      }
    } catch (error) {
      console.error('Erro ao processar envio do e-mail com anexo:', error);
    } finally {
      setEnviando(false);
      alert('Comprovante enviado com sucesso! Sua inscrição está em análise e você receberá a confirmação por e-mail.');
      router.push('/');
    }
  };
};

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header com botão Voltar */}
        <div className="bg-indigo-600 p-6 text-center text-white relative">
          <Link href="/pagamento" className="absolute left-4 top-6 text-sm opacity-80 hover:opacity-100 transition flex items-center gap-1">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold mt-2">Enviar Comprovante</h1>
          <p className="text-xs opacity-90 mt-1">Quase lá! Confirme o seu pagamento do PIX</p>
        </div>

        <form onSubmit={handleEnviar} className="p-6 space-y-6">
          <p className="text-sm text-gray-600 text-center">
            Para acelerar a liberação da sua vaga, faça o upload do comprovante gerado pelo seu banco.
          </p>

          {/* Área de Upload */}
          <label className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 transition text-center bg-gray-50 flex flex-col items-center justify-center cursor-pointer group relative">
            <input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="sr-only"
              required
            />
            
            <div className="space-y-2">
              <span className="text-3xl block group-hover:scale-110 transition duration-200">📤</span>
              {arquivo ? (
                <div>
                  <p className="text-sm font-semibold text-indigo-600 truncate max-w-xs mx-auto">
                    {arquivo.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(arquivo.size / 1024 / 1024).toFixed(2)} MB • Clique para alterar
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Clique para selecionar o arquivo</p>
                  <p className="text-xs text-gray-400 mt-1">Formatos aceitos: PNG, JPG ou PDF</p>
                </div>
              )}   
            </div>
            </label>

          {/* Botão de Envio */}
          <button 
            type="submit"
            disabled={enviando || !arquivo}
            className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 ${
              enviando || !arquivo 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {enviando ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Enviando comprovante...
              </>
            ) : (
              'Concluir Minha Inscrição'
            )}
          </button>
        </form>

      </div>
    </main>
  );
}