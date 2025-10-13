# Atualização da Galeria - Múltiplas Coleções

## 📝 Resumo das Alterações

Esta atualização implementa um sistema completo de **múltiplas galerias** organizadas por edição/evento, permitindo ao cliente gerenciar diferentes coleções de fotos de forma organizada.

## 🎯 Objetivos Alcançados

✅ **Múltiplas Galerias**: Cliente pode criar várias galerias (ex: "Feira 2025", "Feira 2024")  
✅ **Títulos Editáveis**: Cada galeria tem título, descrição e data do evento personalizáveis  
✅ **Design Consistente**: Página de galeria alinhada com o design do resto do site  
✅ **CMS Atualizado**: Interface administrativa funcional para gerenciar galerias e fotos  
✅ **Organização por Data**: Galerias podem ser organizadas cronologicamente  

## 🗄️ Estrutura do Banco de Dados

### Tabela: `galerias`
```sql
- id (INTEGER PRIMARY KEY)
- titulo (TEXT) - Ex: "Feira CEART 2025"
- descricao (TEXT) - Descrição da galeria
- data_evento (TEXT) - Data do evento (YYYY-MM-DD)
- ativo (INTEGER) - 1 = ativa, 0 = inativa
- ordem (INTEGER) - Ordem de exibição
```

### Tabela: `galeria_itens`
```sql
- id (INTEGER PRIMARY KEY)
- galeria_id (INTEGER) - FK para galerias
- titulo (TEXT) - Nome da obra/peça
- descricao (TEXT) - Descrição da foto
- imagem (TEXT) - URL da imagem
- ordem (INTEGER) - Ordem dentro da galeria
```

## 🔌 APIs Disponíveis

### Galerias (Coleções)
- `GET /api/galerias` - Lista todas as galerias
- `GET /api/galerias/ativas` - Lista apenas galerias ativas
- `GET /api/galerias/:id` - Detalhes de uma galeria
- `POST /api/galerias` - Criar nova galeria
- `PUT /api/galerias/:id` - Atualizar galeria
- `DELETE /api/galerias/:id` - Excluir galeria (CASCADE deleta fotos)

### Itens da Galeria (Fotos)
- `GET /api/galerias/:galeriaId/itens` - Lista fotos de uma galeria
- `POST /api/galerias/:galeriaId/itens` - Adicionar foto à galeria
- `GET /api/galeria-itens/:id` - Detalhes de uma foto
- `PUT /api/galeria-itens/:id` - Atualizar foto
- `DELETE /api/galeria-itens/:id` - Excluir foto

## 🎨 Melhorias de Design (Frontend)

### Galeria.css Atualizado
- **Gradiente Verde**: `linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)`
- **Cards Brancos**: Fundo branco com sombras suaves
- **Sombras Consistentes**: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`
- **Transições Suaves**: `transition: all 0.3s ease`
- **Grid Responsivo**: `minmax(320px, 1fr)` com gap de 25px
- **Hover Effects**: Elevação e destaque nos cards

### Nova Seção `.galeria-info`
```css
.galeria-info {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-bottom: 40px;
}
```

## 🖥️ CMS Atualizado

### Interface de Duas Seções

#### 1. **Gerenciar Galerias** (Coleções)
- Lista todas as galerias criadas
- Permite criar, editar e excluir galerias
- Campos: título, descrição, data do evento, ordem, ativo/inativo
- Seleção de galeria para gerenciar fotos

#### 2. **Fotos da Galeria Selecionada**
- Aparece após selecionar uma galeria
- Lista todas as fotos daquela galeria específica
- Permite adicionar, editar e excluir fotos
- Campos: título, descrição, ordem, imagem

### Modais do CMS

#### Modal: Nova Galeria
```html
- Título da Galeria
- Descrição
- Data do Evento
- Ordem de Exibição
- Checkbox: Galeria Ativa
```

#### Modal: Nova Foto
```html
- Galeria (hidden input, preenchido automaticamente)
- Título da Foto
- Descrição
- Ordem de Exibição
- Upload de Imagem
```

## 📱 Experiência do Usuário

### No Site (Frontend)
1. **Home**: Exibe fotos da primeira galeria ativa
2. **Página Galeria**: 
   - Botões para selecionar diferentes galerias
   - Título, descrição e data do evento da galeria selecionada
   - Grid de fotos com modal para visualização ampliada

### No CMS (Admin)
1. **Criar Galeria**: Botão "Nova Galeria" → Preencher dados → Criar
2. **Adicionar Fotos**: 
   - Clicar na galeria desejada
   - Botão "Nova Foto" aparece
   - Upload de imagem + metadados
3. **Editar/Excluir**: Botões em cada card

## 🚀 Deployment

### Realizado
- ✅ Backend: Railway (auto-deploy em push para main)
- ✅ Frontend: Vercel (auto-deploy em push para main)
- ✅ Seed executado: 2 galerias + 6 fotos de exemplo

### URLs
- **Backend API**: https://site-feira-ceart-production.up.railway.app
- **Frontend**: https://site-feira-ceart.vercel.app
- **CMS Admin**: https://site-feira-ceart-production.up.railway.app

## 🔄 Workflow Completo

1. **Cliente acessa CMS**
2. **Cria nova galeria**: "Feira CEART 2026" com data 2026-05-15
3. **Seleciona a galeria criada**
4. **Adiciona fotos**: Upload de imagens com títulos e descrições
5. **Ativa/Desativa galerias**: Controla quais aparecem no site
6. **Frontend atualiza automaticamente**: Site mostra novas galerias

## 📊 Dados de Exemplo (Seed)

### Galerias
```javascript
{ titulo: "Feira CEART 2025", data_evento: "2025-05-10", ativo: 1, ordem: 1 }
{ titulo: "Feira CEART 2024", data_evento: "2024-05-10", ativo: 1, ordem: 2 }
```

### Fotos
- 3 fotos na Feira 2025
- 3 fotos na Feira 2024

## 🐛 Debugging

### Se as galerias não aparecerem no CMS:
1. Verificar console do navegador (F12)
2. Testar endpoint: `GET /api/galerias`
3. Verificar se o banco está populado: `SELECT * FROM galerias;`

### Se as fotos não aparecerem:
1. Selecionar uma galeria primeiro (clicar no card)
2. Verificar se `galeriaAtualId` está setado
3. Testar endpoint: `GET /api/galerias/1/itens`

## 📝 Próximos Passos Sugeridos

- [ ] Adicionar busca/filtro de galerias no CMS
- [ ] Implementar drag-and-drop para reordenar fotos
- [ ] Adicionar paginação para galerias com muitas fotos
- [ ] Implementar upload múltiplo de fotos
- [ ] Adicionar preview da imagem antes do upload

## 👨‍💻 Tecnologias Utilizadas

- **Backend**: Node.js + Express + SQLite3
- **Frontend**: React 19 + TypeScript + Vite
- **Deploy**: Railway (backend) + Vercel (frontend)
- **Database**: SQLite com relacionamento CASCADE
- **API Style**: RESTful com JSON

---

**Data da Atualização**: 2025-01-29  
**Commit**: `e2cd452` - feat: atualiza CMS para nova estrutura de galerias e melhora design da página de galeria
