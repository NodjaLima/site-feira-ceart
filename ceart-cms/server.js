const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Inicializar banco de dados com otimizações
const db = new sqlite3.Database('./ceart_cms.db');

// Otimizações do SQLite para melhor performance
db.serialize(() => {
  // Ativar WAL mode (Write-Ahead Logging) para melhor concorrência
  db.run("PRAGMA journal_mode = WAL");
  // Aumentar cache para melhor performance de leitura
  db.run("PRAGMA cache_size = 10000");
  // Otimizar sincronização
  db.run("PRAGMA synchronous = NORMAL");
  // Ativar foreign keys
  db.run("PRAGMA foreign_keys = ON");
});

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela de expositores
  db.run(`
    CREATE TABLE IF NOT EXISTS expositores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      descricao TEXT,
      contato TEXT,
      telefone TEXT,
      email TEXT,
      site TEXT,
      imagem TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de posts do blog
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      categoria TEXT,
      imagem TEXT,
      autor TEXT,
      readTime TEXT DEFAULT '5 min',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela da galeria
  db.run(`
    CREATE TABLE IF NOT EXISTS galeria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT,
      imagem TEXT NOT NULL,
      categoria TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela do carrossel
  db.run(`
    CREATE TABLE IF NOT EXISTS carrossel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      imagem TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      ativo BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de arquivos/documentos
  db.run(`
    CREATE TABLE IF NOT EXISTS arquivos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      arquivo TEXT NOT NULL,
      categoria TEXT,
      tamanho INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de configurações do site
  db.run(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chave TEXT UNIQUE NOT NULL,
      valor TEXT NOT NULL,
      tipo TEXT DEFAULT 'texto',
      descricao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ==================== ROTAS EXPOSITORES ====================

// GET - Listar expositores
app.get('/api/expositores', (req, res) => {
  db.all('SELECT * FROM expositores ORDER BY nome', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar expositor por ID
app.get('/api/expositores/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM expositores WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Expositor não encontrado' });
    }
    
    res.json(row);
  });
});

// POST - Criar expositor
app.post('/api/expositores', upload.single('foto'), (req, res) => {
  const { nome, categoria, descricao, contato, telefone, email, site } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;
  
  const query = `
    INSERT INTO expositores (nome, categoria, descricao, contato, telefone, email, site, imagem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [nome, categoria, descricao, contato, telefone, email, site, imagem], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Expositor criado com sucesso!' 
    });
  });
});

// PUT - Atualizar expositor
app.put('/api/expositores/:id', upload.single('foto'), (req, res) => {
  const { id } = req.params;
  const { nome, categoria, descricao, contato, telefone, email, site } = req.body;
  
  let query = `
    UPDATE expositores 
    SET nome = ?, categoria = ?, descricao = ?, contato = ?, telefone = ?, email = ?, site = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  let params = [nome, categoria, descricao, contato, telefone, email, site, id];
  
  if (req.file) {
    const imagem = `/uploads/${req.file.filename}`;
    query = `
      UPDATE expositores 
      SET nome = ?, categoria = ?, descricao = ?, contato = ?, telefone = ?, email = ?, site = ?, imagem = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [nome, categoria, descricao, contato, telefone, email, site, imagem, id];
  }
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Expositor não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Expositor atualizado com sucesso!' 
    });
  });
});

// DELETE - Excluir expositor
app.delete('/api/expositores/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM expositores WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Expositor não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Expositor excluído com sucesso!' 
    });
  });
});

// ==================== ROTAS POSTS ====================

// GET - Listar posts
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar post por ID
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    res.json(row);
  });
});

// POST - Criar post
app.post('/api/posts', upload.single('imagem'), (req, res) => {
  const { titulo, excerpt, conteudo, categoria, autor, readTime } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;
  
  const query = `
    INSERT INTO posts (titulo, excerpt, conteudo, categoria, imagem, autor, readTime)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [titulo, excerpt, conteudo, categoria, imagem, autor, readTime || '5 min'], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Post criado com sucesso!' 
    });
  });
});

// PUT - Atualizar post
app.put('/api/posts/:id', upload.single('imagem'), (req, res) => {
  const { id } = req.params;
  const { titulo, excerpt, conteudo, categoria, autor, readTime } = req.body;
  
  let query = `
    UPDATE posts 
    SET titulo = ?, excerpt = ?, conteudo = ?, categoria = ?, autor = ?, readTime = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  let params = [titulo, excerpt, conteudo, categoria, autor, readTime || '5 min', id];
  
  if (req.file) {
    const imagem = `/uploads/${req.file.filename}`;
    query = `
      UPDATE posts 
      SET titulo = ?, excerpt = ?, conteudo = ?, categoria = ?, imagem = ?, autor = ?, readTime = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [titulo, excerpt, conteudo, categoria, imagem, autor, readTime || '5 min', id];
  }
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Post atualizado com sucesso!' 
    });
  });
});

// DELETE - Excluir post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Post excluído com sucesso!' 
    });
  });
});

// ==================== ROTAS GALERIA ====================

// GET - Listar imagens da galeria
app.get('/api/galeria', (req, res) => {
  db.all('SELECT * FROM galeria ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar imagem da galeria por ID
app.get('/api/galeria/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM galeria WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    res.json(row);
  });
});

// POST - Adicionar imagem à galeria
app.post('/api/galeria', upload.single('imagem'), (req, res) => {
  const { titulo, descricao, categoria } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Imagem é obrigatória' });
  }
  
  const imagem = `/uploads/${req.file.filename}`;
  
  const query = `
    INSERT INTO galeria (titulo, descricao, imagem, categoria)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [titulo, descricao, imagem, categoria], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Imagem adicionada à galeria com sucesso!' 
    });
  });
});

// PUT - Atualizar imagem da galeria
app.put('/api/galeria/:id', upload.single('imagem'), (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, categoria } = req.body;
  
  let query = `
    UPDATE galeria 
    SET titulo = ?, descricao = ?, categoria = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  let params = [titulo, descricao, categoria, id];
  
  if (req.file) {
    const imagem = `/uploads/${req.file.filename}`;
    query = `
      UPDATE galeria 
      SET titulo = ?, descricao = ?, categoria = ?, imagem = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [titulo, descricao, categoria, imagem, id];
  }
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    res.json({ 
      success: true, 
      message: 'Imagem da galeria atualizada com sucesso!' 
    });
  });
});

// DELETE - Excluir imagem da galeria
app.delete('/api/galeria/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM galeria WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    res.json({ 
      success: true, 
      message: 'Imagem excluída da galeria com sucesso!' 
    });
  });
});

// ==================== ROTAS CARROSSEL ====================

// GET - Listar slides do carrossel
app.get('/api/carrossel', (req, res) => {
  db.all('SELECT * FROM carrossel WHERE ativo = 1 ORDER BY ordem, created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Listar todos os slides (incluindo inativos)
app.get('/api/carrossel/all', (req, res) => {
  db.all('SELECT * FROM carrossel ORDER BY ordem, created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar slide do carrossel por ID
app.get('/api/carrossel/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM carrossel WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Slide não encontrado' });
    }
    
    res.json(row);
  });
});

// POST - Criar slide do carrossel
app.post('/api/carrossel', upload.single('imagem'), (req, res) => {
  const { titulo, ordem, ativo } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Imagem é obrigatória' });
  }
  
  const imagem = `/uploads/${req.file.filename}`;
  
  const query = `
    INSERT INTO carrossel (titulo, imagem, ordem, ativo)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [titulo, imagem, ordem || 0, ativo || 1], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Slide do carrossel criado com sucesso!' 
    });
  });
});

// PUT - Atualizar slide do carrossel
app.put('/api/carrossel/:id', upload.single('imagem'), (req, res) => {
  const { id } = req.params;
  const { titulo, ordem, ativo } = req.body;
  
  let query = `
    UPDATE carrossel 
    SET titulo = ?, ordem = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  let params = [titulo, ordem || 0, ativo || 1, id];
  
  if (req.file) {
    const imagem = `/uploads/${req.file.filename}`;
    query = `
      UPDATE carrossel 
      SET titulo = ?, imagem = ?, ordem = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [titulo, imagem, ordem || 0, ativo || 1, id];
  }
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Slide não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Slide do carrossel atualizado com sucesso!' 
    });
  });
});

// DELETE - Excluir slide do carrossel
app.delete('/api/carrossel/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM carrossel WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Slide não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Slide excluído do carrossel com sucesso!' 
    });
  });
});

// ==================== ROTAS ARQUIVOS ====================

// GET - Listar arquivos
app.get('/api/arquivos', (req, res) => {
  db.all('SELECT * FROM arquivos ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar arquivo por ID
app.get('/api/arquivos/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM arquivos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    res.json(row);
  });
});

// POST - Upload de arquivo
app.post('/api/arquivos', upload.single('arquivo'), (req, res) => {
  const { nome, descricao, categoria } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo é obrigatório' });
  }
  
  const arquivo = `/uploads/${req.file.filename}`;
  const tamanho = req.file.size;
  
  const query = `
    INSERT INTO arquivos (nome, descricao, arquivo, categoria, tamanho)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [nome, descricao, arquivo, categoria, tamanho], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Arquivo enviado com sucesso!' 
    });
  });
});

// PUT - Atualizar arquivo
app.put('/api/arquivos/:id', upload.single('arquivo'), (req, res) => {
  const { id } = req.params;
  const { nome, descricao, categoria } = req.body;
  
  let query = `
    UPDATE arquivos 
    SET nome = ?, descricao = ?, categoria = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  let params = [nome, descricao, categoria, id];
  
  if (req.file) {
    const arquivo = `/uploads/${req.file.filename}`;
    const tamanho = req.file.size;
    query = `
      UPDATE arquivos 
      SET nome = ?, descricao = ?, categoria = ?, arquivo = ?, tamanho = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [nome, descricao, categoria, arquivo, tamanho, id];
  }
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Arquivo atualizado com sucesso!' 
    });
  });
});

// DELETE - Excluir arquivo
app.delete('/api/arquivos/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM arquivos WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Arquivo excluído com sucesso!' 
    });
  });
});

// ==================== ROTAS CONFIGURAÇÕES ====================

// GET - Listar configurações
app.get('/api/configuracoes', (req, res) => {
  db.all('SELECT * FROM configuracoes ORDER BY chave', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar configuração por chave
app.get('/api/configuracoes/:chave', (req, res) => {
  const { chave } = req.params;
  
  db.get('SELECT * FROM configuracoes WHERE chave = ?', [chave], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }
    
    res.json(row);
  });
});

// POST - Criar configuração
app.post('/api/configuracoes', (req, res) => {
  const { chave, valor, tipo, descricao } = req.body;
  
  const query = `
    INSERT INTO configuracoes (chave, valor, tipo, descricao)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [chave, valor, tipo || 'texto', descricao], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Configuração criada com sucesso!' 
    });
  });
});

// PUT - Atualizar configuração
app.put('/api/configuracoes/:id', (req, res) => {
  const { id } = req.params;
  const { chave, valor, tipo, descricao } = req.body;
  
  const query = `
    UPDATE configuracoes 
    SET chave = ?, valor = ?, tipo = ?, descricao = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [chave, valor, tipo || 'texto', descricao, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }
    
    res.json({ 
      success: true, 
      message: 'Configuração atualizada com sucesso!' 
    });
  });
});

// DELETE - Excluir configuração
app.delete('/api/configuracoes/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM configuracoes WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }
    
    res.json({ 
      success: true, 
      message: 'Configuração excluída com sucesso!' 
    });
  });
});

// Rota para admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({ 
    message: 'CMS CEART API',
    version: '1.0.0',
    endpoints: {
      expositores: '/api/expositores',
      posts: '/api/posts',
      galeria: '/api/galeria',
      carrossel: '/api/carrossel',
      arquivos: '/api/arquivos',
      configuracoes: '/api/configuracoes',
      admin: '/admin'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CMS CEART rodando em http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});