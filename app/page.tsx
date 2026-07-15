import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      {/* Card Principal */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header do Card com a LOGO */}
        <div className="bg-indigo-600 p-6 text-center text-white flex flex-col items-center justify-center gap-3">
          {/* Fundo branco puro da Logo */}
          <div className="w-20 h-20 relative bg-white rounded-full flex items-center justify-center p-3 shadow-md border border-indigo-100">
            <Image 
              src="/logo.png" 
              alt="Logo do Curso" 
              width={70} 
              height={70} 
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold mt-1 max-w-xs mx-auto leading-tight">
              Curso de Prescrição de Órteses de membros inferiores na Neuropediatria
            </h1>
            <p className="text-xs text-indigo-200 text-center mt-2 px-6">
              Domine os critérios clínicos e práticos para a indicação e prescrição de órteses de menbros inferiores em pacientes infantis.
            </p>
          </div>
        </div>

        {/* FOTO DO CURSO */}
        <div className="w-full h-80 relative bg-white border-b border-gray-100">
          <Image 
            src="/curso.png" 
            alt="Imagem do Curso"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Conteúdo Inferior */}
        <div className="p-6 space-y-5">
          
          {/* Bloco de Informações (Grid sem o mapa dentro) */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 p-3 rounded-xl border border-zinc-100">
            <div>
              <p className="text-zinc-400 font-medium">📅 Data</p>
              <p className="text-zinc-800 font-bold mt-0.5">21 e 22 Nov 2026</p>
              <p className="text-zinc-400 font-medium">📅 Horários</p>
              <p className="text-zinc-800 font-bold mt-0.5">8h às 12h e 14h às 18h</p>               
            </div>
            <div>
              <p className="text-zinc-400 font-medium">📍 Localização</p>
              <p className="text-zinc-800 font-bold mt-0.5">Teresina-PI (Presencial)</p>
            </div>
          </div>

          {/* MAPA OCUPANDO 100% DA LARGURA (Fica embaixo do bloco de texto) */}
          <div className="w-full h-48 rounded-xl overflow-hidden border border-zinc-200 shadow-sm mt-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3974.260825850614!2d-42.778869199999995!3d-5.061417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x78e3b61491cbd21%3A0x18011bdad6e5c977!2sJosefa%20Poty%20Fisioterapia%20Neuroinfantil!5e0!3m2!1spt-BR!2sbr!4v1783806481162!5m2!1spt-BR!2sbr"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Valor do Investimento */}
          <div className="flex items-center justify-between border-t border-b border-zinc-100 py-3 px-1">
            <span className="text-zinc-500 font-medium text-sm">Valor do investimento:</span>
            <span className="text-zinc-900 font-black text-xl">R$ 2.000,00</span>
          </div>

          {/* Botão de Ação */}
          <Link 
            href="/inscricao" 
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Quero me Inscrever
          </Link>
        </div>

        {/* Rodapé */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center text-xs text-gray-400">
          Vagas limitadas • Certificado incluso
        </div>
      </div>
    </main>
  );
}