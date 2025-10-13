const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração CORS para produção
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // URL do frontend no Vercel
  /https:\/\/.*\.vercel\.app$/, // Permite preview deploys
  /https:\/\/.*\.railway\.app$/, // Permite Railway (para admin)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mesma origem, curl, postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar se origin está na lista de permitidos
    const isAllowed = allowedOrigins.some(allowed => 
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar diretório de uploads (suporta volume persistente)
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');

// Criar diretório de uploads se não existir
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
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

// Configurar caminho do banco de dados (suporta volume persistente)
const DATA_DIR = process.env.DATA_DIR || '.';
const DB_PATH = path.join(DATA_DIR, 'ceart_cms.db');

console.log(`📁 Banco de dados configurado em: ${DB_PATH}`);

// Criar diretório de dados se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializar banco de dados com otimizações
const db = new sqlite3.Database(DB_PATH);

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
      resumo TEXT,
      conteudo TEXT NOT NULL,
      imagem_destaque TEXT,
      categoria TEXT,
      autor TEXT,
      publicado INTEGER DEFAULT 1,
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
  const { nome, categoria, descricao, cidade, estado, telefone, email, instagram } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;
  
  // Mapear campos do formulário para campos do banco
  const contato = cidade && estado ? `${cidade} - ${estado}` : (cidade || estado || null);
  const site = instagram || null;
  
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
  const { nome, categoria, descricao, cidade, estado, telefone, email, instagram } = req.body;
  
  // Mapear campos do formulário para campos do banco
  const contato = cidade && estado ? `${cidade} - ${estado}` : (cidade || estado || null);
  const site = instagram || null;
  
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
app.post('/api/posts', upload.single('imagem_destaque'), (req, res) => {
  const { titulo, resumo, conteudo, categoria, autor, publicado } = req.body;
  const imagem_destaque = req.file ? `/uploads/${req.file.filename}` : req.body.imagem_destaque || null;
  
  const query = `
    INSERT INTO posts (titulo, resumo, conteudo, categoria, imagem_destaque, autor, publicado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [titulo, resumo, conteudo, categoria, imagem_destaque, autor, publicado !== undefined ? publicado : 1], function(err) {
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
app.put('/api/posts/:id', upload.single('imagem_destaque'), (req, res) => {
  const { id } = req.params;
  const { titulo, resumo, conteudo, categoria, autor, publicado } = req.body;
  
  let query = `
    UPDATE posts 
    SET titulo = ?, resumo = ?, conteudo = ?, categoria = ?, autor = ?, publicado = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  let params = [titulo, resumo, conteudo, categoria, autor, publicado !== undefined ? publicado : 1, id];
  
  if (req.file) {
    const imagem_destaque = `/uploads/${req.file.filename}`;
    query = `
      UPDATE posts 
      SET titulo = ?, resumo = ?, conteudo = ?, categoria = ?, imagem_destaque = ?, autor = ?, publicado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [titulo, resumo, conteudo, categoria, imagem_destaque, autor, publicado !== undefined ? publicado : 1, id];
  } else if (req.body.imagem_destaque) {
    const imagem_destaque = req.body.imagem_destaque;
    query = `
      UPDATE posts 
      SET titulo = ?, resumo = ?, conteudo = ?, categoria = ?, imagem_destaque = ?, autor = ?, publicado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [titulo, resumo, conteudo, categoria, imagem_destaque, autor, publicado !== undefined ? publicado : 1, id];
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

// Endpoint para rodar seed (apenas em desenvolvimento ou com senha)
app.post('/api/seed', (req, res) => {
  const { password } = req.body;
  const SEED_PASSWORD = process.env.SEED_PASSWORD || 'ceart2025';
  
  if (password !== SEED_PASSWORD) {
    return res.status(401).json({ error: 'Senha inválida' });
  }
  
  // Responder imediatamente e executar seed em background
  res.json({ 
    success: true, 
    message: 'Seed iniciado em background. Aguarde alguns segundos e verifique os dados.'
  });
  
  // Executar seed em background
  setImmediate(() => {
    try {
      // Usar require inline para pegar dados de seed
      delete require.cache[require.resolve('./scripts/seed-data.js')];
      const seedData = require('./scripts/seed-data.js');
      
      db.serialize(() => {
        console.log('Iniciando seed do banco de dados...');
        
        // Limpar tabelas
        db.run('DELETE FROM expositores', (err) => {
          if (err) console.error('Erro ao limpar expositores:', err);
        });
        db.run('DELETE FROM posts', (err) => {
          if (err) console.error('Erro ao limpar posts:', err);
        });
        db.run('DELETE FROM galeria', (err) => {
          if (err) console.error('Erro ao limpar galeria:', err);
        });
        db.run('DELETE FROM carrossel', (err) => {
          if (err) console.error('Erro ao limpar carrossel:', err);
        });
        
        // Inserir expositores
        const stmtExpositores = db.prepare('INSERT INTO expositores (nome, categoria, descricao, contato, telefone, email, site) VALUES (?, ?, ?, ?, ?, ?, ?)');
        seedData.expositores.forEach(exp => {
          const contato = `${exp.cidade} - ${exp.estado}`;
          stmtExpositores.run(exp.nome, exp.categoria, exp.descricao, contato, exp.telefone, exp.email, exp.instagram, (err) => {
            if (err) console.error('Erro ao inserir expositor:', err);
          });
        });
        stmtExpositores.finalize(() => {
          console.log(`✓ ${seedData.expositores.length} expositores inseridos`);
        });
        
        // Inserir galeria
        if (seedData.galeria && seedData.galeria.length > 0) {
          const stmtGaleria = db.prepare('INSERT INTO galeria (titulo, descricao, categoria, imagem) VALUES (?, ?, ?, ?)');
          seedData.galeria.forEach(item => {
            stmtGaleria.run(item.titulo, item.descricao, item.categoria, item.imagem, (err) => {
              if (err) console.error('Erro ao inserir item da galeria:', err);
            });
          });
          stmtGaleria.finalize(() => {
            console.log(`✓ ${seedData.galeria.length} itens da galeria inseridos`);
          });
        }
        
        // Inserir posts
        console.log('seedData.posts exists:', !!seedData.posts);
        console.log('seedData.posts length:', seedData.posts?.length);
        if (seedData.posts && seedData.posts.length > 0) {
          console.log('Preparando para inserir posts...');
          const stmtPosts = db.prepare('INSERT INTO posts (titulo, resumo, conteudo, imagem_destaque, categoria, autor, publicado) VALUES (?, ?, ?, ?, ?, ?, ?)');
          seedData.posts.forEach((post, index) => {
            console.log(`Inserindo post ${index + 1}: ${post.titulo}`);
            stmtPosts.run(post.titulo, post.resumo, post.conteudo, post.imagem_destaque, post.categoria, post.autor, post.publicado ? 1 : 0, (err) => {
              if (err) console.error(`Erro ao inserir post ${index + 1}:`, err);
              else console.log(`✓ Post ${index + 1} inserido com sucesso`);
            });
          });
          stmtPosts.finalize((err) => {
            if (err) console.error('Erro ao finalizar posts:', err);
            else {
              console.log(`✓ ${seedData.posts.length} posts inseridos`);
              console.log('Seed completo!');
            }
          });
        } else {
          console.log('Nenhum post para inserir');
        }
      });
    } catch (error) {
      console.error('Erro no seed:', error);
    }
  });
});

// Endpoint de debug para verificar configuração
app.get('/api/debug', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM expositores', (err, row) => {
    const expositoresCount = row?.count || 0;
    
    db.get('SELECT COUNT(*) as count FROM posts', (err2, row2) => {
      const postsCount = row2?.count || 0;
      
      db.get('SELECT COUNT(*) as count FROM galeria', (err3, row3) => {
        const galeriaCount = row3?.count || 0;
        
        res.json({
          database_path: DB_PATH,
          data_dir: DATA_DIR,
          uploads_dir: UPLOADS_DIR,
          expositores_count: expositoresCount,
          posts_count: postsCount,
          galeria_count: galeriaCount,
          node_env: process.env.NODE_ENV
        });
      });
    });
  });
});

// Endpoint para migrar a tabela posts
app.post('/api/migrate-posts', (req, res) => {
  const { password } = req.body;
  const SEED_PASSWORD = process.env.SEED_PASSWORD || 'ceart2025';
  
  if (password !== SEED_PASSWORD) {
    return res.status(401).json({ error: 'Senha inválida' });
  }
  
  db.serialize(() => {
    // Renomear a tabela antiga
    db.run('ALTER TABLE posts RENAME TO posts_old', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao renomear tabela: ' + err.message });
      }
      
      // Criar nova tabela com estrutura correta
      db.run(`
        CREATE TABLE posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          resumo TEXT,
          conteudo TEXT NOT NULL,
          imagem_destaque TEXT,
          categoria TEXT,
          autor TEXT,
          publicado INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err2) => {
        if (err2) {
          return res.status(500).json({ error: 'Erro ao criar nova tabela: ' + err2.message });
        }
        
        // Copiar dados (se houver) da tabela antiga para a nova
        db.run(`
          INSERT INTO posts (id, titulo, resumo, conteudo, imagem_destaque, categoria, autor, publicado, created_at, updated_at)
          SELECT id, titulo, excerpt as resumo, conteudo, imagem as imagem_destaque, categoria, autor, 1 as publicado, created_at, updated_at
          FROM posts_old
        `, (err3) => {
          // Remover tabela antiga
          db.run('DROP TABLE posts_old', () => {
            res.json({ 
              success: true, 
              message: 'Migração da tabela posts concluída com sucesso!'
            });
          });
        });
      });
    });
  });
});

// Endpoint para testar inserção de post
app.post('/api/test-post', (req, res) => {
  const { password } = req.body;
  const SEED_PASSWORD = process.env.SEED_PASSWORD || 'ceart2025';
  
  if (password !== SEED_PASSWORD) {
    return res.status(401).json({ error: 'Senha inválida' });
  }
  
  const testPost = {
    titulo: 'Post de Teste',
    resumo: 'Este é um post de teste',
    conteudo: '<p>Conteúdo de teste</p>',
    imagem_destaque: 'https://via.placeholder.com/800',
    categoria: 'Teste',
    autor: 'Sistema',
    publicado: 1
  };
  
  const query = `
    INSERT INTO posts (titulo, resumo, conteudo, imagem_destaque, categoria, autor, publicado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [testPost.titulo, testPost.resumo, testPost.conteudo, testPost.imagem_destaque, testPost.categoria, testPost.autor, testPost.publicado], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      message: 'Post de teste inserido',
      id: this.lastID
    });
  });
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
      admin: '/admin',
      seed: 'POST /api/seed (requer senha)',
      debug: '/api/debug'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CMS CEART rodando em http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});