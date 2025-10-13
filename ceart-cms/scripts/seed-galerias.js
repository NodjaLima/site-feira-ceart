const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const seedData = require('./seed-data');

// Conectar ao banco
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..');
const dbPath = path.join(DATA_DIR, 'ceart_cms.db');
const db = new sqlite3.Database(dbPath);

console.log(`📁 Usando banco de dados em: ${dbPath}`);
console.log('🌱 Populando galerias e itens...\n');

db.serialize(() => {
  console.log('🗑️  Limpando galerias antigas...');
  
  // Limpar dados antigos
  db.run('DELETE FROM galeria_itens');
  db.run('DELETE FROM galerias');

  console.log('✅ Tabelas limpas\n');

  // Inserir galerias
  console.log('📸 Inserindo galerias...');
  const galeriaStmt = db.prepare(`
    INSERT INTO galerias (titulo, descricao, data_evento, ativo, ordem)
    VALUES (?, ?, ?, ?, ?)
  `);

  seedData.galerias.forEach(galeria => {
    galeriaStmt.run(
      galeria.titulo,
      galeria.descricao,
      galeria.data_evento,
      galeria.ativo ? 1 : 0,
      galeria.ordem
    );
  });

  galeriaStmt.finalize();
  console.log(`✅ ${seedData.galerias.length} galerias inseridas\n`);

  // Inserir itens da galeria
  console.log('🖼️  Inserindo itens da galeria...');
  const itemStmt = db.prepare(`
    INSERT INTO galeria_itens (galeria_id, titulo, descricao, imagem, ordem)
    VALUES (?, ?, ?, ?, ?)
  `);

  seedData.galeriaItens.forEach(item => {
    itemStmt.run(
      item.galeria_id,
      item.titulo,
      item.descricao,
      item.imagem,
      item.ordem
    );
  });

  itemStmt.finalize();
  console.log(`✅ ${seedData.galeriaItens.length} itens inseridos\n`);

  db.close((err) => {
    if (err) {
      console.error('❌ Erro ao fechar banco:', err);
    } else {
      console.log('🎉 Galerias populadas com sucesso!');
      console.log('\n📊 Resumo:');
      console.log(`   - ${seedData.galerias.length} galerias`);
      console.log(`   - ${seedData.galeriaItens.length} fotos`);
      console.log('\n🌐 Acesse: http://localhost:5173/galeria');
    }
  });
});
