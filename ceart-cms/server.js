// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const SqliteStore = require('better-sqlite3-session-store')(session);
const Database = require('better-sqlite3');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração CORS para produção
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001', // Admin Panel (mesma porta do backend)
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
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar caminho do banco de dados de sessões (suporta volume persistente)
const DATA_DIR = process.env.DATA_DIR || '.';
const SESSIONS_DB_PATH = path.join(DATA_DIR, 'sessions.db');

// Criar diretório de dados se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Configuração de sessão com SQLite Store (produção-ready)
const sessionDb = new Database(SESSIONS_DB_PATH);
app.use(session({
  store: new SqliteStore({
    client: sessionDb,
    expired: {
      clear: true,
      intervalMs: 900000 // Limpar sessões expiradas a cada 15 minutos
    }
  }),
  secret: process.env.SESSION_SECRET || 'ceart-cms-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Confiar no proxy do Railway
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS em produção
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax', // lax em produção (mesmo domínio)
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    domain: process.env.COOKIE_DOMAIN || undefined // Permitir configurar domínio
  }
}));

console.log(`🔐 Sessões configuradas com SQLite Store em: ${SESSIONS_DB_PATH}`);

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

// Configurar caminho do banco de dados principal
const DB_PATH = path.join(DATA_DIR, 'ceart_cms.db');

console.log(`📁 Banco de dados configurado em: ${DB_PATH}`);

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
      instagram TEXT,
      facebook TEXT,
      whatsapp TEXT,
      imagem TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Adicionar colunas de redes sociais se não existirem (migração)
  db.run(`ALTER TABLE expositores ADD COLUMN instagram TEXT`, () => {});
  db.run(`ALTER TABLE expositores ADD COLUMN facebook TEXT`, () => {});
  db.run(`ALTER TABLE expositores ADD COLUMN whatsapp TEXT`, () => {});
  
  // Adicionar coluna para galeria de imagens (JSON array com até 5 imagens)
  db.run(`ALTER TABLE expositores ADD COLUMN galeria_imagens TEXT`, () => {});

  // Tabela de usuários para autenticação
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      email TEXT,
      role TEXT DEFAULT 'admin',
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, () => {
    // Criar usuário admin padrão se não existir
    db.get('SELECT id FROM users WHERE username = ?', ['admin'], (err, row) => {
      if (!row) {
        const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
        
        db.run(
          'INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)',
          ['admin', hashedPassword, 'Administrador', 'admin@ceart.com', 'admin'],
          (err) => {
            if (!err) {
              console.log('✅ Usuário admin criado com sucesso!');
              console.log('📧 Username: admin');
              console.log('🔑 Password:', defaultPassword);
              console.log('⚠️  Por favor, altere a senha padrão após o primeiro login!');
            }
          }
        );
      }
    });
  });

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

  // Tabela de galerias (coleções/edições)
  db.run(`
    CREATE TABLE IF NOT EXISTS galerias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT,
      data_evento TEXT,
      ativo BOOLEAN DEFAULT 1,
      ordem INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de itens da galeria (fotos)
  db.run(`
    CREATE TABLE IF NOT EXISTS galeria_itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      galeria_id INTEGER NOT NULL,
      titulo TEXT,
      descricao TEXT,
      imagem TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (galeria_id) REFERENCES galerias(id) ON DELETE CASCADE
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

  // Tabela de regulamento
  db.run(`
    CREATE TABLE IF NOT EXISTS regulamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      subtitulo TEXT,
      conteudo TEXT NOT NULL,
      arquivo_pdf TEXT,
      ano INTEGER,
      ativo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ==================== MIDDLEWARE DE AUTENTICAÇÃO ====================

// Middleware para verificar se o usuário está autenticado
const requireAuth = (req, res, next) => {
  console.log('🔐 Auth check:', {
    path: req.path,
    hasSession: !!req.session,
    sessionId: req.sessionID,
    userId: req.session?.userId
  });
  
  if (req.session && req.session.userId) {
    return next();
  }
  
  // Se for uma requisição da API, retornar 401
  if (req.path.startsWith('/api/')) {
    console.log('❌ API sem autenticação:', req.path);
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  // Se for uma requisição normal, redirecionar para login (apenas se não estiver já no login)
  if (req.path !== '/login') {
    console.log('↩️  Redirecionando para /login');
    return res.redirect('/login');
  }
  
  return next();
};

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// POST - Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }
    
    // Buscar usuário no banco
    db.get(
      'SELECT * FROM users WHERE username = ? AND active = 1',
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        
        if (!user) {
          return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }
        
        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }
        
        // Criar sessão
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.name = user.name;
        req.session.role = user.role;
        
        // Se marcou "lembrar-me", aumentar tempo da sessão
        if (rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 dias
        }
        
        // Salvar sessão antes de responder
        req.session.save((err) => {
          if (err) {
            console.error('❌ Erro ao salvar sessão:', err);
            return res.status(500).json({ error: 'Erro ao salvar sessão' });
          }
          
          console.log('✅ Login bem-sucedido:', user.username);
          console.log('📝 Session ID:', req.sessionID);
          console.log('🍪 Cookie config:', {
            secure: req.session.cookie.secure,
            httpOnly: req.session.cookie.httpOnly,
            sameSite: req.session.cookie.sameSite,
            domain: req.session.cookie.domain
          });
          
          res.json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              role: user.role
            }
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

// GET - Verificar autenticação
app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.session.userId,
      username: req.session.username,
      name: req.session.name,
      role: req.session.role
    }
  });
});

// POST - Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  });
});

// GET - Página de login
app.get('/login', (req, res) => {
  // Se já está autenticado, redirecionar para admin
  if (req.session && req.session.userId) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
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

// POST - Criar expositor (protegido)
app.post('/api/expositores', requireAuth, upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'galeria_fotos', maxCount: 5 }
]), (req, res) => {
  const { nome, categoria, descricao, cidade, estado, telefone, email, instagram, facebook, whatsapp, site } = req.body;
  
  // Foto de perfil
  const imagem = req.files?.foto?.[0] ? `/uploads/${req.files.foto[0].filename}` : null;
  
  // Galeria de imagens
  let galeriaImagens = null;
  if (req.files?.galeria_fotos && req.files.galeria_fotos.length > 0) {
    const galeriaUrls = req.files.galeria_fotos.map(file => `/uploads/${file.filename}`);
    galeriaImagens = JSON.stringify(galeriaUrls);
  }
  
  // Mapear campos do formulário para campos do banco
  const contato = cidade && estado ? `${cidade} - ${estado}` : (cidade || estado || null);
  
  const query = `
    INSERT INTO expositores (nome, categoria, descricao, contato, telefone, email, site, instagram, facebook, whatsapp, imagem, galeria_imagens)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [nome, categoria, descricao, contato, telefone, email, site, instagram, facebook, whatsapp, imagem, galeriaImagens], function(err) {
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

// PUT - Atualizar expositor (protegido)
app.put('/api/expositores/:id', requireAuth, upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'galeria_fotos', maxCount: 5 }
]), (req, res) => {
  const { id } = req.params;
  const { nome, categoria, descricao, cidade, estado, telefone, email, instagram, facebook, whatsapp, site } = req.body;
  
  // Mapear campos do formulário para campos do banco
  const contato = cidade && estado ? `${cidade} - ${estado}` : (cidade || estado || null);
  
  // Buscar galeria existente primeiro
  db.get('SELECT galeria_imagens FROM expositores WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Processar nova galeria se houver
    let galeriaImagens = row?.galeria_imagens || null;
    if (req.files?.galeria_fotos && req.files.galeria_fotos.length > 0) {
      let galeriaAtual = [];
      if (galeriaImagens) {
        try {
          galeriaAtual = JSON.parse(galeriaImagens);
        } catch (e) {
          galeriaAtual = [];
        }
      }
      
      const novasImagens = req.files.galeria_fotos.map(file => `/uploads/${file.filename}`);
      const novaGaleria = [...galeriaAtual, ...novasImagens].slice(0, 5);
      galeriaImagens = JSON.stringify(novaGaleria);
    }
    
    // Montar query de atualização
    let query = `
      UPDATE expositores 
      SET nome = ?, categoria = ?, descricao = ?, contato = ?, telefone = ?, email = ?, site = ?, instagram = ?, facebook = ?, whatsapp = ?, galeria_imagens = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    let params = [nome, categoria, descricao, contato, telefone, email, site, instagram, facebook, whatsapp, galeriaImagens, id];
    
    // Se houver nova foto de perfil, incluir na query
    if (req.files?.foto?.[0]) {
      const imagem = `/uploads/${req.files.foto[0].filename}`;
      query = `
        UPDATE expositores 
        SET nome = ?, categoria = ?, descricao = ?, contato = ?, telefone = ?, email = ?, site = ?, instagram = ?, facebook = ?, whatsapp = ?, imagem = ?, galeria_imagens = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      params = [nome, categoria, descricao, contato, telefone, email, site, instagram, facebook, whatsapp, imagem, galeriaImagens, id];
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
});

// DELETE - Excluir expositor (protegido)
app.delete('/api/expositores/:id', requireAuth, (req, res) => {
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

// POST - Upload de imagens da galeria do expositor (até 5 imagens) (protegido)
app.post('/api/expositores/:id/galeria', requireAuth, upload.array('galeria_fotos', 5), (req, res) => {
  const { id } = req.params;
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }
  
  // Limitar a 5 imagens
  if (req.files.length > 5) {
    return res.status(400).json({ error: 'Máximo de 5 imagens permitidas' });
  }
  
  // Criar array de URLs das imagens
  const imagensUrls = req.files.map(file => `/uploads/${file.filename}`);
  
  // Buscar galeria existente
  db.get('SELECT galeria_imagens FROM expositores WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Expositor não encontrado' });
    }
    
    // Combinar com imagens existentes (se houver)
    let galeriaAtual = [];
    if (row.galeria_imagens) {
      try {
        galeriaAtual = JSON.parse(row.galeria_imagens);
      } catch (e) {
        galeriaAtual = [];
      }
    }
    
    // Adicionar novas imagens (respeitando limite de 5)
    const novaGaleria = [...galeriaAtual, ...imagensUrls].slice(0, 5);
    
    // Atualizar banco de dados
    db.run(
      'UPDATE expositores SET galeria_imagens = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(novaGaleria), id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({
          success: true,
          galeria: novaGaleria,
          message: `${imagensUrls.length} imagem(ns) adicionada(s) à galeria`
        });
      }
    );
  });
});

// DELETE - Remover imagem específica da galeria (protegido)
app.delete('/api/expositores/:id/galeria/:index', requireAuth, (req, res) => {
  const { id, index } = req.params;
  const imageIndex = parseInt(index);
  
  db.get('SELECT galeria_imagens FROM expositores WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Expositor não encontrado' });
    }
    
    let galeria = [];
    if (row.galeria_imagens) {
      try {
        galeria = JSON.parse(row.galeria_imagens);
      } catch (e) {
        return res.status(500).json({ error: 'Erro ao processar galeria' });
      }
    }
    
    if (imageIndex < 0 || imageIndex >= galeria.length) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    // Remover imagem do array
    galeria.splice(imageIndex, 1);
    
    // Atualizar banco de dados
    db.run(
      'UPDATE expositores SET galeria_imagens = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(galeria), id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({
          success: true,
          galeria: galeria,
          message: 'Imagem removida da galeria'
        });
      }
    );
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

// POST - Criar post (protegido)
app.post('/api/posts', requireAuth, upload.single('imagem_destaque'), (req, res) => {
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

// PUT - Atualizar post (protegido)
app.put('/api/posts/:id', requireAuth, upload.single('imagem_destaque'), (req, res) => {
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

// DELETE - Excluir post (protegido)
app.delete('/api/posts/:id', requireAuth, (req, res) => {
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

// ==================== ROTAS GALERIAS (COLEÇÕES) ====================

// GET - Listar galerias
app.get('/api/galerias', (req, res) => {
  db.all('SELECT * FROM galerias ORDER BY ordem, created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Listar galerias ativas
app.get('/api/galerias/ativas', (req, res) => {
  db.all('SELECT * FROM galerias WHERE ativo = 1 ORDER BY ordem, created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar galeria por ID
app.get('/api/galerias/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM galerias WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Galeria não encontrada' });
    }
    
    res.json(row);
  });
});

// POST - Criar galeria (protegido)
app.post('/api/galerias', requireAuth, (req, res) => {
  const { titulo, descricao, data_evento, ativo, ordem } = req.body;
  
  const query = `
    INSERT INTO galerias (titulo, descricao, data_evento, ativo, ordem)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [titulo, descricao, data_evento, ativo !== undefined ? ativo : 1, ordem || 0], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Galeria criada com sucesso!' 
    });
  });
});

// PUT - Atualizar galeria (protegido)
app.put('/api/galerias/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data_evento, ativo, ordem } = req.body;
  
  const query = `
    UPDATE galerias 
    SET titulo = ?, descricao = ?, data_evento = ?, ativo = ?, ordem = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(query, [titulo, descricao, data_evento, ativo !== undefined ? ativo : 1, ordem || 0, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Galeria não encontrada' });
    }
    
    res.json({ 
      success: true, 
      message: 'Galeria atualizada com sucesso!' 
    });
  });
});

// DELETE - Excluir galeria (protegido)
app.delete('/api/galerias/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM galerias WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Galeria não encontrada' });
    }
    
    res.json({ 
      success: true, 
      message: 'Galeria excluída com sucesso!' 
    });
  });
});

// ==================== ROTAS GALERIA ITENS (FOTOS) ====================

// GET - Listar itens de uma galeria
app.get('/api/galerias/:galeriaId/itens', (req, res) => {
  const { galeriaId } = req.params;
  
  db.all('SELECT * FROM galeria_itens WHERE galeria_id = ? ORDER BY ordem', [galeriaId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Buscar item específico
app.get('/api/galeria-itens/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM galeria_itens WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json(row);
  });
});

// POST - Adicionar item à galeria (protegido)
app.post('/api/galerias/:galeriaId/itens', requireAuth, upload.single('imagem'), (req, res) => {
  const { galeriaId } = req.params;
  const { titulo, descricao, ordem } = req.body;
  
  const imagem = req.file ? `/uploads/${req.file.filename}` : req.body.imagem;
  
  if (!imagem) {
    return res.status(400).json({ error: 'Imagem é obrigatória' });
  }
  
  const query = `
    INSERT INTO galeria_itens (galeria_id, titulo, descricao, imagem, ordem)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [galeriaId, titulo, descricao, imagem, ordem || 0], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Item adicionado à galeria com sucesso!' 
    });
  });
});

// PUT - Atualizar item da galeria (protegido)
app.put('/api/galeria-itens/:id', requireAuth, upload.single('imagem'), (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, ordem } = req.body;
  
  let query = `
    UPDATE galeria_itens 
    SET titulo = ?, descricao = ?, ordem = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  let params = [titulo, descricao, ordem || 0, id];
  
  if (req.file) {
    const imagem = `/uploads/${req.file.filename}`;
    query = `
      UPDATE galeria_itens 
      SET titulo = ?, descricao = ?, imagem = ?, ordem = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [titulo, descricao, imagem, ordem || 0, id];
  } else if (req.body.imagem) {
    query = `
      UPDATE galeria_itens 
      SET titulo = ?, descricao = ?, imagem = ?, ordem = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    params = [titulo, descricao, req.body.imagem, ordem || 0, id];
  }
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Item atualizado com sucesso!' 
    });
  });
});

// DELETE - Excluir item da galeria (protegido)
app.delete('/api/galeria-itens/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM galeria_itens WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Item excluído da galeria com sucesso!' 
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

// POST - Criar slide do carrossel (protegido)
app.post('/api/carrossel', requireAuth, upload.single('imagem'), (req, res) => {
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

// PUT - Atualizar slide do carrossel (protegido)
app.put('/api/carrossel/:id', requireAuth, upload.single('imagem'), (req, res) => {
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

// DELETE - Excluir slide do carrossel (protegido)
app.delete('/api/carrossel/:id', requireAuth, (req, res) => {
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

// POST - Criar configuração (protegido)
app.post('/api/configuracoes', requireAuth, (req, res) => {
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

// PUT - Atualizar múltiplas configurações de uma vez (protegido)
app.put('/api/configuracoes', requireAuth, (req, res) => {
  const configuracoes = req.body;
  
  // Preparar promises para atualizar cada configuração
  const promises = Object.keys(configuracoes).map(chave => {
    return new Promise((resolve, reject) => {
      const { valor, descricao } = configuracoes[chave];
      
      // Tentar atualizar primeiro
      db.run(
        'UPDATE configuracoes SET valor = ?, updated_at = CURRENT_TIMESTAMP WHERE chave = ?',
        [valor, chave],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          // Se não atualizou nenhuma linha, inserir nova
          if (this.changes === 0) {
            db.run(
              'INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES (?, ?, ?, ?)',
              [chave, valor, 'texto', descricao],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          } else {
            resolve();
          }
        }
      );
    });
  });
  
  Promise.all(promises)
    .then(() => {
      res.json({
        success: true,
        message: 'Configurações atualizadas com sucesso!'
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// PUT - Atualizar configuração individual (protegido)
app.put('/api/configuracoes/:id', requireAuth, (req, res) => {
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

// DELETE - Excluir configuração (protegido)
app.delete('/api/configuracoes/:id', requireAuth, (req, res) => {
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

// POST - Upload de logos (navbar e footer) (protegido)
app.post('/api/configuracoes/upload-logos', requireAuth, upload.fields([
  { name: 'navbarLogo', maxCount: 1 },
  { name: 'footerLogo', maxCount: 1 }
]), (req, res) => {
  try {
    const updates = [];
    
    // Upload do logo do navbar
    if (req.files?.navbarLogo?.[0]) {
      const navbarLogoUrl = `/uploads/${req.files.navbarLogo[0].filename}`;
      updates.push({ chave: 'navbar_logo', valor: navbarLogoUrl });
    }
    
    // Upload do logo do footer
    if (req.files?.footerLogo?.[0]) {
      const footerLogoUrl = `/uploads/${req.files.footerLogo[0].filename}`;
      updates.push({ chave: 'footer_logo', valor: footerLogoUrl });
    }
    
    // Atualizar ou criar as configurações
    const promises = updates.map(({ chave, valor }) => {
      return new Promise((resolve, reject) => {
        // Tentar atualizar primeiro
        db.run(
          'UPDATE configuracoes SET valor = ?, updated_at = CURRENT_TIMESTAMP WHERE chave = ?',
          [valor, chave],
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            
            // Se não atualizou nenhuma linha, inserir nova
            if (this.changes === 0) {
              db.run(
                'INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES (?, ?, ?, ?)',
                [chave, valor, 'imagem', `Logo ${chave === 'navbar_logo' ? 'do Navbar' : 'do Footer'}`],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            } else {
              resolve();
            }
          }
        );
      });
    });
    
    Promise.all(promises)
      .then(() => {
        res.json({
          success: true,
          message: 'Logos atualizadas com sucesso!',
          logos: updates
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
      
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para admin (protegida com autenticação)
app.get('/admin', requireAuth, (req, res) => {
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
        db.run('DELETE FROM galeria_itens', (err) => {
          if (err) console.error('Erro ao limpar galeria_itens:', err);
        });
        db.run('DELETE FROM galerias', (err) => {
          if (err) console.error('Erro ao limpar galerias:', err);
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
        
        // Inserir galerias (coleções)
        if (seedData.galerias && seedData.galerias.length > 0) {
          const stmtGalerias = db.prepare('INSERT INTO galerias (titulo, descricao, data_evento, ativo, ordem) VALUES (?, ?, ?, ?, ?)');
          seedData.galerias.forEach(galeria => {
            stmtGalerias.run(galeria.titulo, galeria.descricao, galeria.data_evento, galeria.ativo ? 1 : 0, galeria.ordem, (err) => {
              if (err) console.error('Erro ao inserir galeria:', err);
            });
          });
          stmtGalerias.finalize(() => {
            console.log(`✓ ${seedData.galerias.length} galerias inseridas`);
          });
        }
        
        // Inserir itens da galeria (fotos)
        if (seedData.galeriaItens && seedData.galeriaItens.length > 0) {
          const stmtItens = db.prepare('INSERT INTO galeria_itens (galeria_id, titulo, descricao, imagem, ordem) VALUES (?, ?, ?, ?, ?)');
          seedData.galeriaItens.forEach(item => {
            stmtItens.run(item.galeria_id, item.titulo, item.descricao, item.imagem, item.ordem, (err) => {
              if (err) console.error('Erro ao inserir item da galeria:', err);
            });
          });
          stmtItens.finalize(() => {
            console.log(`✓ ${seedData.galeriaItens.length} itens da galeria inseridos`);
          });
        }
        
        // Inserir posts
        if (seedData.posts && seedData.posts.length > 0) {
          const stmtPosts = db.prepare('INSERT INTO posts (titulo, resumo, conteudo, imagem_destaque, categoria, autor, publicado) VALUES (?, ?, ?, ?, ?, ?, ?)');
          seedData.posts.forEach(post => {
            stmtPosts.run(post.titulo, post.resumo, post.conteudo, post.imagem_destaque, post.categoria, post.autor, post.publicado ? 1 : 0, (err) => {
              if (err) console.error('Erro ao inserir post:', err);
            });
          });
          stmtPosts.finalize(() => {
            console.log(`✓ ${seedData.posts.length} posts inseridos`);
          });
        }
        
        // Inserir carrossel
        if (seedData.carrossel && seedData.carrossel.length > 0) {
          const stmtCarrossel = db.prepare('INSERT INTO carrossel (titulo, imagem, ordem, ativo) VALUES (?, ?, ?, ?)');
          seedData.carrossel.forEach(item => {
            stmtCarrossel.run(item.titulo, item.imagem, item.ordem, item.ativo ? 1 : 0, (err) => {
              if (err) console.error('Erro ao inserir item do carrossel:', err);
            });
          });
          stmtCarrossel.finalize(() => {
            console.log(`✓ ${seedData.carrossel.length} itens do carrossel inseridos`);
            console.log('Seed completo!');
          });
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
      
      db.get('SELECT COUNT(*) as count FROM galerias', (err3, row3) => {
        const galeriasCount = row3?.count || 0;
        
        db.get('SELECT COUNT(*) as count FROM galeria_itens', (err4, row4) => {
          const galeriaItensCount = row4?.count || 0;
          
          db.get('SELECT COUNT(*) as count FROM carrossel', (err5, row5) => {
            const carrosselCount = row5?.count || 0;
            
            res.json({
              database_path: DB_PATH,
              data_dir: DATA_DIR,
              uploads_dir: UPLOADS_DIR,
              expositores_count: expositoresCount,
              posts_count: postsCount,
              galerias_count: galeriasCount,
              galeria_itens_count: galeriaItensCount,
              carrossel_count: carrosselCount,
              node_env: process.env.NODE_ENV
            });
          });
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

// Endpoint para migrar estrutura de galerias
app.post('/api/migrate-galerias', (req, res) => {
  const { password } = req.body;
  const SEED_PASSWORD = process.env.SEED_PASSWORD || 'ceart2025';
  
  if (password !== SEED_PASSWORD) {
    return res.status(401).json({ error: 'Senha inválida' });
  }
  
  db.serialize(() => {
    // Verificar se a tabela antiga existe
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='galeria'", (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar tabela: ' + err.message });
      }
      
      if (!row) {
        return res.json({ 
          success: true, 
          message: 'Tabela galeria não existe, estrutura nova já está em uso!'
        });
      }
      
      // Renomear tabela antiga
      db.run('ALTER TABLE galeria RENAME TO galeria_old', (err2) => {
        if (err2) {
          return res.status(500).json({ error: 'Erro ao renomear tabela: ' + err2.message });
        }
        
        // Criar tabela galerias (coleções)
        db.run(`
          CREATE TABLE galerias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            data_evento TEXT,
            ativo BOOLEAN DEFAULT 1,
            ordem INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err3) => {
          if (err3) {
            return res.status(500).json({ error: 'Erro ao criar tabela galerias: ' + err3.message });
          }
          
          // Criar tabela galeria_itens
          db.run(`
            CREATE TABLE galeria_itens (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              galeria_id INTEGER NOT NULL,
              titulo TEXT,
              descricao TEXT,
              imagem TEXT NOT NULL,
              ordem INTEGER DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (galeria_id) REFERENCES galerias(id) ON DELETE CASCADE
            )
          `, (err4) => {
            if (err4) {
              return res.status(500).json({ error: 'Erro ao criar tabela galeria_itens: ' + err4.message });
            }
            
            // Criar uma galeria padrão para migrar os itens antigos
            db.run(`
              INSERT INTO galerias (titulo, descricao, data_evento, ativo, ordem)
              VALUES ('Galeria Geral', 'Imagens migradas da estrutura anterior', '2025-01-01', 1, 1)
            `, function(err5) {
              if (err5) {
                return res.status(500).json({ error: 'Erro ao criar galeria padrão: ' + err5.message });
              }
              
              const galeriaId = this.lastID;
              
              // Migrar itens antigos para a nova estrutura
              db.run(`
                INSERT INTO galeria_itens (galeria_id, titulo, descricao, imagem, ordem)
                SELECT ${galeriaId}, titulo, descricao, imagem, 0
                FROM galeria_old
              `, (err6) => {
                // Remover tabela antiga
                db.run('DROP TABLE galeria_old', () => {
                  res.json({ 
                    success: true, 
                    message: 'Migração da estrutura de galerias concluída! Todos os itens foram movidos para "Galeria Geral".'
                  });
                });
              });
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

// ==================== ROTAS REGULAMENTO ====================

// GET - Obter regulamento ativo
app.get('/api/regulamento', (req, res) => {
  const query = 'SELECT * FROM regulamento WHERE ativo = 1 ORDER BY ano DESC LIMIT 1';
  
  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Nenhum regulamento ativo encontrado' });
    }
    res.json(row);
  });
});

// GET - Listar todos os regulamentos (para o CMS)
app.get('/api/regulamentos', (req, res) => {
  const query = 'SELECT * FROM regulamento ORDER BY ano DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET - Obter regulamento por ID
app.get('/api/regulamento/:id', (req, res) => {
  const query = 'SELECT * FROM regulamento WHERE id = ?';
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Regulamento não encontrado' });
    }
    res.json(row);
  });
});

// POST - Criar novo regulamento (protegido)
app.post('/api/regulamento', requireAuth, upload.single('arquivo_pdf'), (req, res) => {
  const { titulo, subtitulo, conteudo, ano, ativo } = req.body;
  const arquivo_pdf = req.file ? `/uploads/${req.file.filename}` : null;
  
  if (!titulo || !conteudo) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }
  
  const query = `
    INSERT INTO regulamento (titulo, subtitulo, conteudo, arquivo_pdf, ano, ativo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const ativoValue = ativo === 'on' || ativo === '1' || ativo === 1 ? 1 : 0;
  
  db.run(query, [titulo, subtitulo, conteudo, arquivo_pdf, ano, ativoValue], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      success: true, 
      message: 'Regulamento criado com sucesso',
      id: this.lastID
    });
  });
});

// PUT - Atualizar regulamento (protegido)
app.put('/api/regulamento/:id', requireAuth, upload.single('arquivo_pdf'), (req, res) => {
  const { titulo, subtitulo, conteudo, ano, ativo } = req.body;
  const arquivo_pdf = req.file ? `/uploads/${req.file.filename}` : null;
  
  if (!titulo || !conteudo) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }
  
  let query;
  let params;
  
  if (arquivo_pdf) {
    query = `
      UPDATE regulamento 
      SET titulo = ?, subtitulo = ?, conteudo = ?, arquivo_pdf = ?, ano = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const ativoValue = ativo === 'on' || ativo === '1' || ativo === 1 ? 1 : 0;
    params = [titulo, subtitulo, conteudo, arquivo_pdf, ano, ativoValue, req.params.id];
  } else {
    query = `
      UPDATE regulamento 
      SET titulo = ?, subtitulo = ?, conteudo = ?, ano = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const ativoValue = ativo === 'on' || ativo === '1' || ativo === 1 ? 1 : 0;
    params = [titulo, subtitulo, conteudo, ano, ativoValue, req.params.id];
  }
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Regulamento não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Regulamento atualizado com sucesso'
    });
  });
});

// DELETE - Excluir regulamento (protegido)
app.delete('/api/regulamento/:id', requireAuth, (req, res) => {
  const query = 'DELETE FROM regulamento WHERE id = ?';
  
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Regulamento não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Regulamento excluído com sucesso'
    });
  });
});

// ==================== CONFIGURAÇÃO DE EMAIL ====================

// Validar configuração de email ao iniciar o servidor
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  AVISO: Variáveis EMAIL_USER e/ou EMAIL_PASS não configuradas!');
  console.warn('⚠️  O envio de emails do formulário de contato não funcionará.');
  console.warn('⚠️  Configure as variáveis de ambiente para ativar esta funcionalidade.');
}

// Configurar transportador de email (apenas se as credenciais existirem)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('✉️  Transportador de email configurado com sucesso');
}

// Rota para enviar email do formulário de contato
app.post('/api/contato/enviar', async (req, res) => {
  try {
    // Verificar se o email está configurado
    if (!transporter || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Tentativa de envio de email sem configuração adequada');
      return res.status(503).json({ 
        success: false, 
        message: 'Serviço de email temporariamente indisponível. Entre em contato pelos canais alternativos.' 
      });
    }

    const { nome, email, telefone, mensagem } = req.body;

    // Validações
    if (!nome || !email || !telefone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome, email e telefone são obrigatórios' 
      });
    }

    // Buscar email de destino das configurações do CMS
    const emailDestino = await new Promise((resolve) => {
      db.get(
        'SELECT valor FROM configuracoes WHERE chave = ? AND ativo = 1',
        ['site_email'],
        (err, row) => {
          if (!err && row && row.valor) {
            resolve(row.valor);
          } else {
            // Se não houver configuração no CMS, usa o EMAIL_USER como destino
            resolve(process.env.EMAIL_USER);
          }
        }
      );
    });

    console.log(`📧 Preparando envio de email para: ${emailDestino}`);

    // Configurar opções do email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailDestino,
      subject: `📧 Novo contato do site - ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Novo Contato do Site</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            ${mensagem ? `<p><strong>Mensagem:</strong></p><p style="white-space: pre-wrap;">${mensagem}</p>` : ''}
          </div>
          <p style="color: #7f8c8d; font-size: 12px;">
            Este email foi enviado automaticamente através do formulário de contato do site Feira CEART.
          </p>
        </div>
      `,
      replyTo: email
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email enviado com sucesso de ${nome} (${email}) para ${emailDestino}`);

    res.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso! Em breve entraremos em contato.' 
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({ 
    message: 'CMS CEART API',
    version: '1.0.0',
    endpoints: {
      expositores: '/api/expositores',
      posts: '/api/posts',
      galerias: '/api/galerias',
      carrossel: '/api/carrossel',
      arquivos: '/api/arquivos',
      configuracoes: '/api/configuracoes',
      regulamento: '/api/regulamento',
      contato: 'POST /api/contato/enviar',
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