const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const seedData = require('./seed-data');

// Conectar ao banco
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..');
const dbPath = path.join(DATA_DIR, 'ceart_cms.db');
const db = new sqlite3.Database(dbPath);

console.log(`📁 Usando banco de dados em: ${dbPath}`);
console.log('🌱 Populando expositores...\n');

db.serialize(() => {
  console.log('🗑️  Limpando expositores antigos...');
  
  // Limpar dados antigos
  db.run('DELETE FROM expositores');

  console.log('✅ Tabela limpa\n');

  // Inserir expositores
  console.log('👥 Inserindo expositores...');
  const expositorStmt = db.prepare(`
    INSERT INTO expositores (nome, categoria, descricao, contato, telefone, email, site, imagem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  seedData.expositores.forEach((expositor, index) => {
    // Imagens de exemplo do Unsplash baseadas na categoria
    let imagem = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400';
    
    if (expositor.categoria === 'Alimentação') {
      imagem = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400';
    } else if (expositor.categoria === 'Decoração') {
      imagem = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
    } else if (expositor.categoria === 'Beleza') {
      imagem = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400';
    } else if (expositor.categoria === 'Vestuário') {
      imagem = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400';
    } else if (expositor.categoria === 'Bebidas') {
      imagem = 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400';
    }

    const contato = `${expositor.cidade || ''}, ${expositor.estado || ''}`.trim().replace(/^,\s*|,\s*$/g, '');

    expositorStmt.run(
      expositor.nome,
      expositor.categoria,
      expositor.descricao,
      contato,
      expositor.telefone,
      expositor.email,
      expositor.instagram,
      imagem
    );
  });

  expositorStmt.finalize();
  console.log(`✅ ${seedData.expositores.length} expositores inseridos\n`);

  db.close((err) => {
    if (err) {
      console.error('❌ Erro ao fechar banco:', err);
    } else {
      console.log('🎉 Expositores populados com sucesso!');
      console.log('\n📊 Resumo:');
      console.log(`   - ${seedData.expositores.length} expositores`);
      console.log('\n🌐 Acesse: http://localhost:5173/expositores');
    }
  });
});
