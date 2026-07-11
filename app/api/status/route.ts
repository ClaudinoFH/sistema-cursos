import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_abXrgHoM_4mCH93Eo82tPfuGpZoCEWHWP'); // Use a sua mesma chave do Resend

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, status } = body;

    let assunto = '';
    let mensagemHtml = '';

    if (status === 'Aprovado') {
      assunto = `🎉 Vaga Confirmada! Curso de Prescrição de Órteses na Neuropediatria`;
      mensagemHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #10b981; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Sua inscrição foi aprovada! 🚀</h2>
          <p style="font-size: 16px; color: #374151;">Olá, <strong>${nome}</strong>,</p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            Seu comprovante de pagamento foi validado com sucesso e sua vaga no <strong>Curso de Prescrição de Órteses na Neuropediatria</strong> está oficialmente garantida!
          </p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0; color: #166534;">
            <strong>📍 Próximos passos:</strong><br>
            Em breve você receberá os detalhes de acesso e o material de apoio direto no seu e-mail e no grupo de avisos.
          </div>
          
          <p style="font-size: 13px; color: #9ca3af; text-align: center; margin-top: 30px;">
            Nos vemos no curso! • Equipe de Organização
          </p>
        </div>
      `;
    } else if (status === 'Rejeitado') {
      assunto = `⚠️ Atualização sobre sua Inscrição`;
      mensagemHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #ef4444; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Problema na validação do comprovante</h2>
          <p style="font-size: 16px; color: #374151;">Olá, <strong>${nome}</strong>,</p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            Não conseguimos validar o comprovante de pagamento anexado ao seu cadastro.
          </p>
          
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; color: #991b1b;">
            <strong>💡 Como resolver:</strong><br>
            Por favor, entre em contato conosco respondendo a este e-mail ou enviando uma mensagem para o nosso suporte para solucionarmos e liberarmos sua vaga.
          </div>
        </div>
      `;
    }

    // Dispara o e-mail para o ALUNO (email que veio da rota)
    const { data, error } = await resend.emails.send({
      from: 'Curso de Prescrição de Órteses na Neuropediatria <onboarding@resend.dev>',
      to: email, // O e-mail do próprio aluno cadastrado
      subject: assunto,
      html: mensagemHtml,
    });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha interna' }, { status: 500 });
  }
}