#!/usr/bin/env node

/**
 * Script de teste para envio de email
 * 
 * Este script testa a funcionalidade de envio de email do formulário de contato
 * sem precisar usar o frontend.
 * 
 * Uso:
 *   node test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n🧪 TESTE DE ENVIO DE EMAIL\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar configurações
console.log('\n📋 Configurações:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || 'NÃO CONFIGURADO'}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '****** (configurado)' : 'NÃO CONFIGURADO'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('\n❌ ERRO: Variáveis de ambiente EMAIL_USER e EMAIL_PASS não estão configuradas!');
  console.log('\n💡 Para configurar:');
  console.log('   1. Edite o arquivo .env em ceart-cms/');
  console.log('   2. Adicione EMAIL_USER=seu_email@gmail.com');
  console.log('   3. Gere uma senha de app no Gmail:');
  console.log('      - Acesse: https://myaccount.google.com/apppasswords');
  console.log('      - Ative verificação em 2 etapas');
  console.log('      - Gere uma senha de app');
  console.log('   4. Adicione EMAIL_PASS=senha_de_16_caracteres (sem espaços)');
  console.log('   5. Execute este script novamente\n');
  process.exit(1);
}

// Configurar transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Dados de teste
const dadosTeste = {
  nome: 'Teste do Sistema',
  email: 'teste@example.com',
  telefone: '(11) 99999-9999',
  mensagem: 'Esta é uma mensagem de teste do sistema de envio de emails.'
};

console.log('\n📧 Preparando email de teste...');
console.log(`   De: ${process.env.EMAIL_USER}`);
console.log(`   Para: ${process.env.EMAIL_USER}`);
console.log(`   Assunto: Teste - Novo contato do site`);

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // Enviar para o mesmo email para teste
  subject: `🧪 TESTE - Novo contato do site - ${dadosTeste.nome}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ffeb3b; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <p style="margin: 0; color: #000; font-weight: bold;">⚠️ ESTE É UM EMAIL DE TESTE</p>
      </div>
      <h2 style="color: #2c3e50;">Novo Contato do Site</h2>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Nome:</strong> ${dadosTeste.nome}</p>
        <p><strong>Email:</strong> ${dadosTeste.email}</p>
        <p><strong>Telefone:</strong> ${dadosTeste.telefone}</p>
        <p><strong>Mensagem:</strong></p>
        <p style="white-space: pre-wrap;">${dadosTeste.mensagem}</p>
      </div>
      <p style="color: #7f8c8d; font-size: 12px;">
        Este email foi enviado automaticamente através do formulário de contato do site Feira CEART.
      </p>
    </div>
  `,
  replyTo: dadosTeste.email
};

console.log('\n📤 Enviando email...\n');

transporter.sendMail(mailOptions)
  .then((info) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ EMAIL ENVIADO COM SUCESSO!\n');
    console.log('📊 Detalhes:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log('\n📬 Verifique sua caixa de entrada em: ' + process.env.EMAIL_USER);
    console.log('\n💡 Se não recebeu o email, verifique:');
    console.log('   1. Caixa de SPAM');
    console.log('   2. Se a senha de app está correta');
    console.log('   3. Se a verificação em 2 etapas está ativada no Gmail\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  })
  .catch((error) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('\n❌ ERRO AO ENVIAR EMAIL!\n');
    console.error('Erro:', error.message);
    console.error('\n💡 Possíveis causas:');
    console.error('   1. Senha de app incorreta ou não configurada');
    console.error('   2. Verificação em 2 etapas não ativada no Gmail');
    console.error('   3. Senha de app revogada');
    console.error('   4. Problemas de conexão com o servidor do Gmail');
    console.error('\n🔧 Como resolver:');
    console.error('   1. Acesse: https://myaccount.google.com/apppasswords');
    console.error('   2. Gere uma nova senha de app');
    console.error('   3. Atualize EMAIL_PASS no arquivo .env');
    console.error('   4. Execute este script novamente\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  });
