import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_JxXk6X9u_KDP6fsdWRYCPdM7BPhgCCKdD');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nome, 
      email, 
      telefone, 
      dataNascimento,
      cpf,
      cep,
      endereco,
      naturalidade,
      concluiuFisio,
      tempoFisioterapeuta,
      periodoFaculdade,
      escalaSeguranca,
      justificativaSeguranca,
      nomeArquivo, 
      tipoArquivo, 
      arquivoBase64 
    } = body;

    // Dispara o e-mail configurando o relatório completo
    const { data, error } = await resend.emails.send({
      from: 'Sistema de Inscrições <onboarding@resend.dev>',
      to: 'potyjosefa@gmail.com', // ← Substitua pelo seu e-mail real
      subject: `🚨 Nova Inscrição + Comprovante: ${nome}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; color: #333;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-bottom: 20px;">Nova Inscrição Completa!</h2>
          <p style="font-size: 15px; color: #4b5563;">Um aluno acabou de enviar os dados cadastrais e o comprovante de pagamento.</p>
          
          <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px; margin-bottom: 10px;">1. Dados Pessoais</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; line-height: 1.6;">
            <p style="margin: 4px 0;"><strong>👤 Nome:</strong> ${nome}</p>
            <p style="margin: 4px 0;"><strong>📅 Data de Nascimento:</strong> ${dataNascimento || 'Não informado'}</p>
            <p style="margin: 4px 0;"><strong>💳 CPF:</strong> ${cpf || 'Não informado'}</p>
            <p style="margin: 4px 0;"><strong>📧 Email:</strong> ${email || 'Não informado'}</p>
            <p style="margin: 4px 0;"><strong>📞 Telefone:</strong> ${telefone || 'Não informado'}</p>            
            <p style="margin: 4px 0;"><strong>🌍 Naturalidade:</strong> ${naturalidade || 'Não informado'}</p>
          </div>

          <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px; margin-bottom: 10px;">2. Localização</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; line-height: 1.6;">
            <p style="margin: 4px 0;"><strong>📮 CEP:</strong> ${cep || 'Não informado'}</p>
            <p style="margin: 4px 0;"><strong>🏠 Endereço:</strong> ${endereco || 'Não informado'}</p>
          </div>

          <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px; margin-bottom: 10px;">3. Perfil Acadêmico / Profissional</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; line-height: 1.6;">
            <p style="margin: 4px 0;"><strong>🎓 Concluiu Fisioterapia?:</strong> ${concluiuFisio === 'sim' ? 'Sim (Profissional)' : 'Não (Estudante)'}</p>
            ${concluiuFisio === 'sim' ? `<p style="margin: 4px 0;"><strong>⏱️ Tempo de atuação:</strong> ${tempoFisioterapeuta}</p>` : ''}
            ${concluiuFisio === 'nao' ? `<p style="margin: 4px 0;"><strong>⏳ Período que está cursando:</strong> ${periodoFaculdade}</p>` : ''}
          </div>

          <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px; margin-bottom: 10px;">4. Autoavaliação e Órteses</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; line-height: 1.6;">
            <p style="margin: 4px 0;"><strong>📊 Segurança para prescrever órteses (1 a 10):</strong> <span style="color: #4f46e5; font-weight: bold; font-size: 16px;">${escalaSeguranca}</span></p>
            <p style="margin: 8px 0 4px 0; border-top: 1px dashed #e5e7eb; padding-top: 8px;"><strong>📝 Justificativa/Dúvidas:</strong><br>${justificativaSeguranca || 'Nenhuma justificativa enviada.'}</p>
          </div>
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
            O comprovante de pagamento foi anexado automaticamente a este e-mail.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: nomeArquivo,
          content: arquivoBase64,
          contentType: tipoArquivo,
        },
      ],
    });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha interna no servidor' }, { status: 500 });
  }
}