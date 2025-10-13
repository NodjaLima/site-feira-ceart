# Instruções para Deploy no Hostgator

## Problema das Rotas SPA
O problema ocorre porque o Hostgator (Apache) não entende que é uma Single Page Application (SPA) e tenta buscar arquivos físicos para cada rota.

## Solução Implementada

### 1. Arquivo .htaccess Configurado
- Redireciona todas as rotas para `index.html`
- Exceções para arquivos estáticos (CSS, JS, imagens)
- Configuração específica para Hostgator

### 2. Configuração do Vite
- `base: '/'` para caminhos absolutos
- Build otimizado para produção

## Como fazer o upload:

### Opção 1: Upload direto dos arquivos do /dist
1. Faça o build: `yarn build`
2. Acesse o cPanel do Hostgator
3. Vá em "Gerenciador de Arquivos"
4. Entre na pasta `public_html` (ou pasta do seu domínio)
5. **IMPORTANTE**: Apague todos os arquivos existentes primeiro
6. Faça upload de TODOS os arquivos da pasta `dist/`
7. Certifique-se que o arquivo `.htaccess` foi enviado

### Opção 2: Se ainda não funcionar, tente esta versão do .htaccess:

```apache
Options +FollowSymLinks
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.html [L]

<IfModule mod_headers.c>
  <FilesMatch "\.(css|js)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
</IfModule>
```

### Opção 3: Para subdomínio ou subpasta
Se o site está em uma subpasta, ajuste o RewriteBase:
```apache
RewriteEngine On
RewriteBase /sua-subpasta/

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /sua-subpasta/index.html [L,QSA]
```

## Verificação
1. Teste a página inicial (/)
2. Teste uma rota direta (ex: seusite.com/contato)
3. Teste navegação pelos links do menu

## Problemas Comuns:
- **404 em rotas**: Arquivo .htaccess não foi enviado ou não funciona
- **Página em branco**: Verifique console do navegador para erros de CORS
- **CSS não carrega**: Verifique se assets estão no lugar certo

## Suporte
Se ainda não funcionar, entre em contato com o suporte do Hostgator e peça para:
1. Verificar se mod_rewrite está habilitado
2. Confirmar se .htaccess está sendo processado
3. Verificar permissões dos arquivos
