// Admin Panel JavaScript para CEART CMS
const API_BASE = '/api';

// State management
let expositores = [];
let posts = [];
let galeria = [];
let carrossel = [];
let arquivos = [];

// ===================== INICIALIZAÇÃO =====================

document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadExpositores();
    loadPosts();
    loadGaleria();
    loadCarrossel();
    loadArquivos();
    loadConfiguracoes();
    setupForms();
});

// ===================== FUNÇÕES DE NAVEGAÇÃO =====================

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Hide all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// ===================== MODAL MANAGEMENT =====================

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Reset form if exists
    const form = document.getElementById(modalId).querySelector('form');
    if (form) {
        form.reset();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ===================== ESTATÍSTICAS =====================

async function loadStats() {
    try {
        const [expositoresRes, postsRes, galeriaRes, carrosselRes] = await Promise.all([
            fetch(`${API_BASE}/expositores`),
            fetch(`${API_BASE}/posts`),
            fetch(`${API_BASE}/galeria`),
            fetch(`${API_BASE}/carrossel`)
        ]);
        
        const expositoresData = await expositoresRes.json();
        const postsData = await postsRes.json();
        const galeriaData = await galeriaRes.json();
        const carrosselData = await carrosselRes.json();
        
        const totalExpositores = expositoresData.data.length;
        const totalPosts = postsData.data.length;
        const totalGaleria = galeriaData.data.length;
        const totalSlides = carrosselData.data.length;
        
        document.getElementById('statsContainer').innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${totalExpositores}</div>
                <div class="stat-label">Expositores Cadastrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalPosts}</div>
                <div class="stat-label">Posts Publicados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalGaleria}</div>
                <div class="stat-label">Imagens na Galeria</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalSlides}</div>
                <div class="stat-label">Slides no Carrossel</div>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// ===================== EXPOSITORES =====================

async function loadExpositores() {
    try {
        const response = await fetch(`${API_BASE}/expositores`);
        const data = await response.json();
        expositores = data.data;
        renderExpositores();
    } catch (error) {
        console.error('Erro ao carregar expositores:', error);
        showError('Erro ao carregar expositores');
    }
}

function renderExpositores() {
    const container = document.getElementById('expositoresList');
    
    if (expositores.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhum expositor cadastrado ainda.</p>
                <button class="btn btn-primary" onclick="openModal('expositorModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Cadastrar Primeiro Expositor
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = expositores.map(expositor => `
        <div class="item-card">
            <div class="item-title">${expositor.nome}</div>
            <div class="item-meta">
                <strong>${expositor.especialidade}</strong><br>
                ${expositor.cidade ? `${expositor.cidade}, ${expositor.estado}` : 'Localização não informada'}<br>
                <small>Cadastrado em: ${new Date(expositor.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary" onclick="editExpositor(${expositor.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deleteExpositor(${expositor.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

async function saveExpositor(formData) {
    try {
        const form = document.getElementById('expositorForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        const url = isEdit ? `${API_BASE}/expositores/${editId}` : `${API_BASE}/expositores`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Expositor atualizado com sucesso!' : 'Expositor cadastrado com sucesso!');
            closeModal('expositorModal');
            
            // Reset form for next use
            form.removeAttribute('data-edit-id');
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Salvar Expositor';
            document.querySelector('#expositorModal .modal-header h3').innerHTML = '<i class="fas fa-user-plus"></i> Novo Expositor';
            
            loadExpositores();
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar expositor' : 'Erro ao cadastrar expositor'));
        }
    } catch (error) {
        console.error('Erro ao salvar expositor:', error);
        showError('Erro ao salvar expositor');
    }
}

async function editExpositor(id) {
    const expositor = expositores.find(e => e.id === id);
    if (expositor) {
        // Preencher o formulário com os dados do expositor
        const form = document.getElementById('expositorForm');
        form.querySelector('[name="nome"]').value = expositor.nome || '';
        form.querySelector('[name="categoria"]').value = expositor.categoria || '';
        form.querySelector('[name="cidade"]').value = expositor.cidade || '';
        form.querySelector('[name="estado"]').value = expositor.estado || '';
        form.querySelector('[name="telefone"]').value = expositor.telefone || '';
        form.querySelector('[name="email"]').value = expositor.email || '';
        form.querySelector('[name="instagram"]').value = expositor.instagram || '';
        form.querySelector('[name="descricao"]').value = expositor.descricao || '';
        
        // Alterar o formulário para modo de edição
        form.setAttribute('data-edit-id', id);
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Expositor';
        
        // Abrir o modal
        openModal('expositorModal');
        document.querySelector('#expositorModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Expositor';
    }
}

async function deleteExpositor(id) {
    const expositor = expositores.find(e => e.id === id);
    if (expositor && confirm(`Tem certeza que deseja excluir o expositor "${expositor.nome}"?`)) {
        try {
            const response = await fetch(`${API_BASE}/expositores/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Expositor excluído com sucesso!');
                loadExpositores();
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir expositor');
            }
        } catch (error) {
            console.error('Erro ao excluir expositor:', error);
            showError('Erro ao excluir expositor');
        }
    }
}

// ===================== POSTS DO BLOG =====================

async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE}/posts`);
        const data = await response.json();
        posts = data.data;
        renderPosts();
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        showError('Erro ao carregar posts');
    }
}

function renderPosts() {
    const container = document.getElementById('postsList');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-blog" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhum post publicado ainda.</p>
                <button class="btn btn-primary" onclick="openModal('postModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Criar Primeiro Post
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="item-card">
            <div class="item-title">${post.titulo}</div>
            <div class="item-meta">
                <strong>Categoria:</strong> ${post.categoria}<br>
                <strong>Autor:</strong> ${post.autor}<br>
                <strong>Publicado:</strong> ${new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
            </div>
            <p style="margin: 1rem 0; color: #666; line-height: 1.4;">
                ${post.conteudo.substring(0, 150)}${post.conteudo.length > 150 ? '...' : ''}
            </p>
            <div class="item-actions">
                <button class="btn btn-secondary" onclick="editPost(${post.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

async function savePost(formData) {
    try {
        const form = document.getElementById('postForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        const url = isEdit ? `${API_BASE}/posts/${editId}` : `${API_BASE}/posts`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Post atualizado com sucesso!' : 'Post publicado com sucesso!');
            closeModal('postModal');
            
            // Reset form for next use
            form.removeAttribute('data-edit-id');
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Publicar Post';
            document.querySelector('#postModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Novo Post';
            
            loadPosts();
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar post' : 'Erro ao publicar post'));
        }
    } catch (error) {
        console.error('Erro ao salvar post:', error);
        showError('Erro ao salvar post');
    }
}

async function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        // Preencher o formulário com os dados do post
        const form = document.getElementById('postForm');
        form.querySelector('[name="titulo"]').value = post.titulo || '';
        form.querySelector('[name="excerpt"]').value = post.excerpt || '';
        form.querySelector('[name="categoria"]').value = post.categoria || '';
        form.querySelector('[name="autor"]').value = post.autor || '';
        form.querySelector('[name="readTime"]').value = post.readTime || '5 min';
        form.querySelector('[name="conteudo"]').value = post.conteudo || '';
        
        // Alterar o formulário para modo de edição
        form.setAttribute('data-edit-id', id);
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Post';
        
        // Abrir o modal
        openModal('postModal');
        document.querySelector('#postModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Post';
    }
}

async function deletePost(id) {
    const post = posts.find(p => p.id === id);
    if (post && confirm(`Tem certeza que deseja excluir o post "${post.titulo}"?`)) {
        try {
            const response = await fetch(`${API_BASE}/posts/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Post excluído com sucesso!');
                loadPosts();
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir post');
            }
        } catch (error) {
            console.error('Erro ao excluir post:', error);
            showError('Erro ao excluir post');
        }
    }
}

// ===================== GALERIA =====================

async function loadGaleria() {
    try {
        const response = await fetch(`${API_BASE}/galeria`);
        const data = await response.json();
        galeria = data.data;
        renderGaleria();
    } catch (error) {
        console.error('Erro ao carregar galeria:', error);
        showError('Erro ao carregar galeria');
    }
}

function renderGaleria() {
    const container = document.getElementById('galeriaList');
    
    if (galeria.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-images" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhuma imagem na galeria ainda.</p>
                <button class="btn btn-primary" onclick="openModal('galeriaModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Adicionar Primeira Imagem
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = galeria.map(item => `
        <div class="item-card gallery-item">
            <img src="${item.imagem}" alt="${item.titulo}" style="width: 100%; height: 200px; object-fit: cover;">
            <div class="gallery-overlay">
                <div class="item-title">${item.titulo}</div>
                <div class="item-meta">
                    <strong>Categoria:</strong> ${item.categoria}<br>
                    ${item.descricao ? item.descricao.substring(0, 80) + '...' : ''}
                </div>
                <div class="item-actions" style="margin-top: 1rem;">
                    <button class="btn btn-secondary btn-sm" onclick="editGaleria(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteGaleria(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function saveGaleria(formData) {
    try {
        const form = document.getElementById('galeriaForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        const url = isEdit ? `${API_BASE}/galeria/${editId}` : `${API_BASE}/galeria`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Imagem atualizada com sucesso!' : 'Imagem adicionada à galeria com sucesso!');
            closeModal('galeriaModal');
            
            // Reset form for next use
            form.removeAttribute('data-edit-id');
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Adicionar à Galeria';
            document.querySelector('#galeriaModal .modal-header h3').innerHTML = '<i class="fas fa-images"></i> Nova Imagem da Galeria';
            form.querySelector('[name="imagem"]').setAttribute('required', 'required');
            
            loadGaleria();
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar imagem' : 'Erro ao adicionar imagem'));
        }
    } catch (error) {
        console.error('Erro ao salvar na galeria:', error);
        showError('Erro ao salvar imagem');
    }
}

async function editGaleria(id) {
    const item = galeria.find(g => g.id === id);
    if (item) {
        // Preencher o formulário com os dados da imagem
        const form = document.getElementById('galeriaForm');
        form.querySelector('[name="titulo"]').value = item.titulo || '';
        form.querySelector('[name="categoria"]').value = item.categoria || '';
        form.querySelector('[name="descricao"]').value = item.descricao || '';
        
        // Alterar o formulário para modo de edição
        form.setAttribute('data-edit-id', id);
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Imagem';
        
        // Abrir o modal
        openModal('galeriaModal');
        document.querySelector('#galeriaModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Imagem';
        
        // Tornar o campo de imagem opcional para edição
        form.querySelector('[name="imagem"]').removeAttribute('required');
    }
}

async function deleteGaleria(id) {
    const item = galeria.find(g => g.id === id);
    if (item && confirm(`Tem certeza que deseja excluir a imagem "${item.titulo}"?`)) {
        try {
            const response = await fetch(`${API_BASE}/galeria/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Imagem excluída com sucesso!');
                loadGaleria();
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir imagem');
            }
        } catch (error) {
            console.error('Erro ao excluir imagem:', error);
            showError('Erro ao excluir imagem');
        }
    }
}

// ===================== CARROSSEL =====================

async function loadCarrossel() {
    try {
        const response = await fetch(`${API_BASE}/carrossel`);
        const data = await response.json();
        carrossel = data.data;
        renderCarrossel();
    } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
        showError('Erro ao carregar carrossel');
    }
}

function renderCarrossel() {
    const container = document.getElementById('carrosselList');
    
    if (carrossel.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-sliders-h" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhum slide no carrossel ainda.</p>
                <button class="btn btn-primary" onclick="openModal('carrosselModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Criar Primeiro Slide
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = carrossel.map(slide => `
        <div class="item-card">
            <div class="carousel-preview" style="background-image: url('${slide.imagem}');">
                <div class="carousel-content">
                    <h4>${slide.titulo}</h4>
                    ${slide.subtitulo ? `<p>${slide.subtitulo}</p>` : ''}
                    ${slide.link_texto ? `<small>Botão: "${slide.link_texto}"</small>` : ''}
                </div>
            </div>
            <div class="item-actions" style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="editCarrossel(${slide.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deleteCarrossel(${slide.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

async function saveCarrossel(formData) {
    try {
        const form = document.getElementById('carrosselForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        const url = isEdit ? `${API_BASE}/carrossel/${editId}` : `${API_BASE}/carrossel`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Slide atualizado com sucesso!' : 'Slide adicionado ao carrossel com sucesso!');
            closeModal('carrosselModal');
            
            // Reset form for next use
            form.removeAttribute('data-edit-id');
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Adicionar Slide';
            document.querySelector('#carrosselModal .modal-header h3').innerHTML = '<i class="fas fa-sliders-h"></i> Novo Slide do Carrossel';
            form.querySelector('[name="imagem"]').setAttribute('required', 'required');
            
            loadCarrossel();
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar slide' : 'Erro ao adicionar slide'));
        }
    } catch (error) {
        console.error('Erro ao salvar carrossel:', error);
        showError('Erro ao salvar slide');
    }
}

async function editCarrossel(id) {
    const slide = carrossel.find(c => c.id === id);
    if (slide) {
        // Preencher o formulário com os dados do slide
        const form = document.getElementById('carrosselForm');
        form.querySelector('[name="titulo"]').value = slide.titulo || '';
        form.querySelector('[name="ordem"]').value = slide.ordem || 0;
        form.querySelector('[name="ativo"]').value = slide.ativo || 1;
        
        // Alterar o formulário para modo de edição
        form.setAttribute('data-edit-id', id);
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Slide';
        
        // Abrir o modal
        openModal('carrosselModal');
        document.querySelector('#carrosselModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Slide';
        
        // Tornar o campo de imagem opcional para edição
        form.querySelector('[name="imagem"]').removeAttribute('required');
    }
}

async function deleteCarrossel(id) {
    const slide = carrossel.find(c => c.id === id);
    if (slide && confirm(`Tem certeza que deseja excluir o slide "${slide.titulo}"?`)) {
        try {
            const response = await fetch(`${API_BASE}/carrossel/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Slide excluído com sucesso!');
                loadCarrossel();
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir slide');
            }
        } catch (error) {
            console.error('Erro ao excluir slide:', error);
            showError('Erro ao excluir slide');
        }
    }
}

// ===================== ARQUIVOS =====================

async function loadArquivos() {
    try {
        const response = await fetch(`${API_BASE}/arquivos`);
        const data = await response.json();
        arquivos = data.data;
        renderArquivos();
    } catch (error) {
        console.error('Erro ao carregar arquivos:', error);
        showError('Erro ao carregar arquivos');
    }
}

function renderArquivos() {
    const container = document.getElementById('arquivosList');
    
    if (arquivos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-file-pdf" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhum arquivo enviado ainda.</p>
                <button class="btn btn-primary" onclick="openModal('arquivoModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Enviar Primeiro Arquivo
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = arquivos.map(arquivo => `
        <div class="item-card">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <i class="fas fa-file-pdf file-icon"></i>
                <div>
                    <div class="item-title">${arquivo.nome}</div>
                    <div class="file-info">
                        <span class="file-size">${formatFileSize(arquivo.tamanho)} • ${arquivo.tipo}</span>
                    </div>
                </div>
            </div>
            <div class="item-meta">
                <strong>Categoria:</strong> ${arquivo.categoria}<br>
                ${arquivo.descricao ? arquivo.descricao.substring(0, 100) + '...' : ''}
            </div>
            <div class="item-actions">
                <a href="${arquivo.arquivo}" target="_blank" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download
                </a>
                <button class="btn btn-secondary" onclick="editArquivo(${arquivo.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deleteArquivo(${arquivo.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

async function saveArquivo(formData) {
    try {
        const form = document.getElementById('arquivoForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        const url = isEdit ? `${API_BASE}/arquivos/${editId}` : `${API_BASE}/arquivos`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Arquivo atualizado com sucesso!' : 'Arquivo enviado com sucesso!');
            closeModal('arquivoModal');
            
            // Reset form for next use
            form.removeAttribute('data-edit-id');
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-upload"></i> Enviar Arquivo';
            document.querySelector('#arquivoModal .modal-header h3').innerHTML = '<i class="fas fa-file-upload"></i> Novo Arquivo/Documento';
            form.querySelector('[name="arquivo"]').setAttribute('required', 'required');
            
            loadArquivos();
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar arquivo' : 'Erro ao enviar arquivo'));
        }
    } catch (error) {
        console.error('Erro ao salvar arquivo:', error);
        showError('Erro ao salvar arquivo');
    }
}

async function editArquivo(id) {
    const arquivo = arquivos.find(a => a.id === id);
    if (arquivo) {
        // Preencher o formulário com os dados do arquivo
        const form = document.getElementById('arquivoForm');
        form.querySelector('[name="nome"]').value = arquivo.nome || '';
        form.querySelector('[name="categoria"]').value = arquivo.categoria || '';
        form.querySelector('[name="descricao"]').value = arquivo.descricao || '';
        
        // Alterar o formulário para modo de edição
        form.setAttribute('data-edit-id', id);
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Arquivo';
        
        // Abrir o modal
        openModal('arquivoModal');
        document.querySelector('#arquivoModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Arquivo';
        
        // Tornar o campo de arquivo opcional para edição
        form.querySelector('[name="arquivo"]').removeAttribute('required');
    }
}

async function deleteArquivo(id) {
    const arquivo = arquivos.find(a => a.id === id);
    if (arquivo && confirm(`Tem certeza que deseja excluir o arquivo "${arquivo.nome}"?`)) {
        try {
            const response = await fetch(`${API_BASE}/arquivos/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Arquivo excluído com sucesso!');
                loadArquivos();
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir arquivo');
            }
        } catch (error) {
            console.error('Erro ao excluir arquivo:', error);
            showError('Erro ao excluir arquivo');
        }
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===================== CONFIGURAÇÕES =====================

async function loadConfiguracoes() {
    try {
        const response = await fetch(`${API_BASE}/configuracoes`);
        const data = await response.json();
        const config = data.data;
        
        // Preencher campos com valores do banco
        if (config.site_name) document.getElementById('siteName').value = config.site_name;
        if (config.site_email) document.getElementById('siteEmail').value = config.site_email;
        if (config.site_phone) document.getElementById('sitePhone').value = config.site_phone;
        if (config.site_address) document.getElementById('siteAddress').value = config.site_address;
        // Adicionar mais campos conforme necessário
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

async function saveConfiguracoes() {
    const configuracoes = {
        site_name: { valor: document.getElementById('siteName').value, descricao: 'Nome do site' },
        site_email: { valor: document.getElementById('siteEmail').value, descricao: 'Email principal' },
        site_phone: { valor: document.getElementById('sitePhone').value, descricao: 'Telefone de contato' },
        site_address: { valor: document.getElementById('siteAddress').value, descricao: 'Endereço da feira' },
        site_whatsapp: { valor: document.getElementById('siteWhatsapp').value, descricao: 'WhatsApp' },
        site_instagram: { valor: document.getElementById('siteInstagram').value, descricao: 'Instagram' },
        site_facebook: { valor: document.getElementById('siteFacebook').value, descricao: 'Facebook' },
        site_youtube: { valor: document.getElementById('siteYoutube').value, descricao: 'YouTube' },
        site_url: { valor: document.getElementById('siteUrl').value, descricao: 'Site oficial' },
        feira_inicio: { valor: document.getElementById('feiraInicio').value, descricao: 'Data de início' },
        feira_fim: { valor: document.getElementById('feiraFim').value, descricao: 'Data de fim' },
        site_slogan: { valor: document.getElementById('siteSlogan').value, descricao: 'Slogan/Subtítulo' }
    };
    
    try {
        const response = await fetch(`${API_BASE}/configuracoes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(configuracoes)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Configurações salvas com sucesso!');
        } else {
            showError(result.error || 'Erro ao salvar configurações');
        }
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showError('Erro ao salvar configurações');
    }
}

// ===================== FORMULÁRIOS =====================

function setupForms() {
    // Form de Expositor
    const expositorForm = document.getElementById('expositorForm');
    if (expositorForm) {
        expositorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveExpositor(formData);
        });
    }
    
    // Form de Post
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            savePost(formData);
        });
    }
    
    // Form de Galeria
    const galeriaForm = document.getElementById('galeriaForm');
    if (galeriaForm) {
        galeriaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveGaleria(formData);
        });
    }
    
    // Form de Carrossel
    const carrosselForm = document.getElementById('carrosselForm');
    if (carrosselForm) {
        carrosselForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveCarrossel(formData);
        });
    }
    
    // Form de Arquivo
    const arquivoForm = document.getElementById('arquivoForm');
    if (arquivoForm) {
        arquivoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveArquivo(formData);
        });
    }
}

// ===================== UTILITÁRIOS =====================

function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showInfo(message) {
    showMessage(message, 'info');
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 1.2rem;">&times;</button>
    `;
    
    // Add to container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// ===================== API HELPERS =====================

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ===================== UPLOAD HELPERS =====================

function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(previewId).src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ===================== KEYBOARD SHORTCUTS =====================

document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Ctrl+N for new expositor
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openModal('expositorModal');
    }
    
    // Ctrl+P for new post
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        openModal('postModal');
    }
});

// ===================== EXPORT FUNCTIONS =====================

window.showTab = showTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.editExpositor = editExpositor;
window.deleteExpositor = deleteExpositor;
window.editPost = editPost;
window.deletePost = deletePost;
window.editGaleria = editGaleria;
window.deleteGaleria = deleteGaleria;
window.editCarrossel = editCarrossel;
window.deleteCarrossel = deleteCarrossel;
window.editArquivo = editArquivo;
window.deleteArquivo = deleteArquivo;
window.saveConfiguracoes = saveConfiguracoes;
window.previewImage = previewImage;