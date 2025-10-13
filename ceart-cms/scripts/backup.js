#!/usr/bin/env node

/**
 * Script de Backup do Banco de Dados SQLite
 * Cria backups automáticos do banco de dados com timestamp
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'ceart_cms.db');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

// Criar diretório de backups se não existir
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
  console.log('📁 Diretório de backups criado');
}

// Gerar nome do arquivo com timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupFileName = `ceart_cms_backup_${timestamp}.db`;
const backupPath = path.join(BACKUP_DIR, backupFileName);

// Copiar arquivo do banco de dados
try {
  fs.copyFileSync(DB_PATH, backupPath);
  const stats = fs.statSync(backupPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('✅ Backup criado com sucesso!');
  console.log(`📄 Arquivo: ${backupFileName}`);
  console.log(`📦 Tamanho: ${fileSizeInMB} MB`);
  console.log(`📍 Local: ${backupPath}`);
  
  // Limpar backups antigos (manter apenas os últimos 10)
  cleanOldBackups();
  
} catch (error) {
  console.error('❌ Erro ao criar backup:', error.message);
  process.exit(1);
}

function cleanOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.startsWith('ceart_cms_backup_') && file.endsWith('.db'))
    .map(file => ({
      name: file,
      path: path.join(BACKUP_DIR, file),
      time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);
  
  // Manter apenas os 10 backups mais recentes
  const MAX_BACKUPS = 10;
  if (files.length > MAX_BACKUPS) {
    const toDelete = files.slice(MAX_BACKUPS);
    toDelete.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Backup antigo removido: ${file.name}`);
    });
  }
  
  console.log(`\n📊 Total de backups mantidos: ${Math.min(files.length, MAX_BACKUPS)}`);
}
