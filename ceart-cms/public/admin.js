// Admin Panel JavaScript para CEART CMS
const API_BASE = '/api';

// State management
let expositores = [];
let posts = [];
let galeria = [];
let carrossel = [];
let regulamentos = [];

// ===================== INICIALIZAÇÃO =====================

document.addEventListener('DOMContentLoaded', function() {
    // Carregar informações do usuário
    loadUserInfo();
    
    loadStats();
    loadExpositores();
    loadPosts();
    loadGalerias();
    loadCarrossel();
    loadRegulamentos();
    loadConfiguracoes();
    loadMensagens();
    loadMensagensStats();
    setupForms();
});

// ===================== AUTENTICAÇÃO =====================

async function loadUserInfo() {
    try {
        const response = await fetch(`${API_BASE}/auth/check`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('userName').textContent = data.user.name || data.user.username;
            document.getElementById('userRole').textContent = data.user.role === 'admin' ? 'Administrador' : data.user.role;
        } else {
            // Não autenticado, redirecionar para login
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = '/login';
    }
}

async function logout() {
    if (!confirm('Deseja realmente sair?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
    }
}

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
        const [expositoresRes, postsRes, galeriasRes, galeriaItensRes, carrosselRes] = await Promise.all([
            fetch(`${API_BASE}/expositores`),
            fetch(`${API_BASE}/posts`),
            fetch(`${API_BASE}/galerias`),
            fetch(`${API_BASE}/galeria-itens/stats/count`),
            fetch(`${API_BASE}/carrossel`)
        ]);
        
        const expositoresData = await expositoresRes.json();
        const postsData = await postsRes.json();
        const galeriasData = await galeriasRes.json();
        const galeriaItensData = await galeriaItensRes.json();
        const carrosselData = await carrosselRes.json();
        
        const totalExpositores = Array.isArray(expositoresData) ? expositoresData.length : (expositoresData.data?.length || 0);
        const totalPosts = Array.isArray(postsData) ? postsData.length : (postsData.data?.length || 0);
        const totalGalerias = Array.isArray(galeriasData) ? galeriasData.length : (galeriasData.data?.length || 0);
        const totalGaleriaImagens = galeriaItensData.total || 0;
        const totalSlides = Array.isArray(carrosselData) ? carrosselData.length : (carrosselData.data?.length || 0);
        
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
                <div class="stat-number">${totalGalerias}</div>
                <div class="stat-label">Galerias Criadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalGaleriaImagens}</div>
                <div class="stat-label">Total de Imagens</div>
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
        expositores = await response.json();
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
            <div style="display: flex; gap: 1rem; align-items: start; margin-bottom: 1rem;">
                <img 
                    src="${expositor.imagem || '/avatar-placeholder.svg'}" 
                    alt="${expositor.nome}"
                    style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 2px solid #e0e0e0;"
                    onerror="this.onerror=null; this.src='/avatar-placeholder.svg'"
                >
                <div style="flex: 1;">
                    <div class="item-title" style="margin-bottom: 0.5rem;">${expositor.nome}</div>
                    <div class="item-meta">
                        <strong>${expositor.categoria || 'Categoria não informada'}</strong><br>
                        ${expositor.contato || 'Localização não informada'}<br>
                        <small>Cadastrado em: ${new Date(expositor.created_at).toLocaleDateString('pt-BR')}</small>
                    </div>
                </div>
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
            
            // Limpar preview de galeria
            const preview = document.getElementById('galeria_preview');
            if (preview) preview.style.display = 'none';
            const galeriaInputReset = document.getElementById('galeria_fotos');
            if (galeriaInputReset) galeriaInputReset.value = '';
            
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
        
        // Separar cidade e estado do campo 'contato' que vem como "Cidade - Estado"
        let cidade = '';
        let estado = '';
        if (expositor.contato) {
            const partes = expositor.contato.split('-').map(p => p.trim());
            cidade = partes[0] || '';
            estado = partes[1] || '';
        }
        form.querySelector('[name="cidade"]').value = cidade;
        form.querySelector('[name="estado"]').value = estado;
        
        form.querySelector('[name="telefone"]').value = expositor.telefone || '';
        form.querySelector('[name="email"]').value = expositor.email || '';
        form.querySelector('[name="instagram"]').value = expositor.instagram || '';
        form.querySelector('[name="facebook"]').value = expositor.facebook || '';
        form.querySelector('[name="whatsapp"]').value = expositor.whatsapp || '';
        form.querySelector('[name="site"]').value = expositor.site || '';
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
        posts = await response.json();
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

// Variável global para controlar a galeria selecionada
let galeriaAtualId = null;

async function loadGalerias() {
    try {
        const response = await fetch(`${API_BASE}/galerias`);
        galeria = await response.json();
        renderGalerias();
    } catch (error) {
        console.error('Erro ao carregar galerias:', error);
        showError('Erro ao carregar galerias');
    }
}

function renderGalerias() {
    const container = document.getElementById('galeriasCollectionList');
    
    if (galeria.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-images" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhuma galeria criada ainda.</p>
                <button class="btn btn-primary" onclick="openModal('novaGaleriaModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Criar Primeira Galeria
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = galeria.map(item => `
        <div class="item-card ${item.ativo ? 'ativo' : 'inativo'}" onclick="selectGaleria(${item.id})" style="cursor: pointer; ${galeriaAtualId === item.id ? 'border: 3px solid #4CAF50;' : ''}">
            <div class="item-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="item-title">${item.titulo}</h4>
                <span class="badge ${item.ativo ? 'badge-success' : 'badge-secondary'}">
                    ${item.ativo ? 'Ativa' : 'Inativa'}
                </span>
            </div>
            <div class="item-meta">
                <strong>Data do Evento:</strong> ${item.data_evento || 'Não definida'}<br>
                <strong>Ordem:</strong> ${item.ordem}<br>
                ${item.descricao ? item.descricao.substring(0, 100) + '...' : ''}
            </div>
            <div class="item-actions" style="margin-top: 1rem;">
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); editGaleria(${item.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteGaleria(${item.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

async function selectGaleria(id) {
    galeriaAtualId = id;
    renderGalerias(); // Re-renderiza para mostrar seleção
    await loadGaleriaItens(id);
    
    // Mostra o card de itens e atualiza o título
    const card = document.getElementById('galeriaItensCard');
    card.style.display = 'block';
    
    const galeriaObj = galeria.find(g => g.id === id);
    const headerTitle = card.querySelector('.card-header h3');
    if (galeriaObj) {
        headerTitle.innerHTML = `<i class="fas fa-images"></i> Fotos da Galeria: ${galeriaObj.titulo}`;
    }
    
    // Habilita o botão de adicionar foto
    document.getElementById('galeriaIdInput').value = id;
}

async function loadGaleriaItens(galeriaId) {
    try {
        const response = await fetch(`${API_BASE}/galerias/${galeriaId}/itens`);
        const itens = await response.json();
        renderGaleriaItens(itens);
    } catch (error) {
        console.error('Erro ao carregar itens da galeria:', error);
        showError('Erro ao carregar itens da galeria');
    }
}

function renderGaleriaItens(itens) {
    const container = document.getElementById('galeriaItensList');
    
    if (itens.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhuma foto nesta galeria ainda.</p>
                <button class="btn btn-primary" onclick="openModal('novaImagemModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Adicionar Primeira Foto
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = itens.map(item => `
        <div class="item-card gallery-item">
            <img src="${item.imagem}" alt="${item.titulo}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;">
            <div style="padding: 1rem;">
                <div class="item-title">${item.titulo}</div>
                <div class="item-meta">
                    <strong>Ordem:</strong> ${item.ordem}<br>
                    ${item.descricao ? item.descricao.substring(0, 80) + '...' : 'Sem descrição'}
                </div>
                <div class="item-actions" style="margin-top: 1rem;">
                    <button class="btn btn-secondary btn-sm" onclick="editGaleriaItem(${item.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteGaleriaItem(${item.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== GERENCIAR GALERIAS (Coleções) ==========

async function saveGaleria(formData) {
    try {
        const form = document.getElementById('novaGaleriaForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        // Converter formData para JSON
        const data = {
            titulo: formData.get('titulo'),
            descricao: formData.get('descricao'),
            data_evento: formData.get('data_evento'),
            ordem: parseInt(formData.get('ordem')) || 0,
            ativo: formData.get('ativo') === 'on' ? 1 : 0
        };
        
        const url = isEdit ? `${API_BASE}/galerias/${editId}` : `${API_BASE}/galerias`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Galeria atualizada com sucesso!' : 'Galeria criada com sucesso!');
            closeModal('novaGaleriaModal');
            
            // Reset form
            form.reset();
            form.removeAttribute('data-edit-id');
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Criar Galeria';
            document.querySelector('#novaGaleriaModal .modal-header h3').innerHTML = '<i class="fas fa-folder"></i> Nova Galeria';
            
            loadGalerias();
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar galeria' : 'Erro ao criar galeria'));
        }
    } catch (error) {
        console.error('Erro ao salvar galeria:', error);
        showError('Erro ao salvar galeria');
    }
}

async function editGaleria(id) {
    const item = galeria.find(g => g.id === id);
    if (item) {
        const form = document.getElementById('novaGaleriaForm');
        form.querySelector('[name="titulo"]').value = item.titulo || '';
        form.querySelector('[name="descricao"]').value = item.descricao || '';
        form.querySelector('[name="data_evento"]').value = item.data_evento || '';
        form.querySelector('[name="ordem"]').value = item.ordem || 0;
        form.querySelector('[name="ativo"]').checked = item.ativo === 1;
        
        // Modo de edição
        form.setAttribute('data-edit-id', id);
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Galeria';
        
        openModal('novaGaleriaModal');
        document.querySelector('#novaGaleriaModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Galeria';
    }
}

async function deleteGaleria(id) {
    const item = galeria.find(g => g.id === id);
    if (item && confirm(`Tem certeza que deseja excluir a galeria "${item.titulo}"?\n\nTodas as fotos desta galeria também serão excluídas!`)) {
        try {
            const response = await fetch(`${API_BASE}/galerias/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Galeria excluída com sucesso!');
                
                // Se era a galeria selecionada, limpa a seleção
                if (galeriaAtualId === id) {
                    galeriaAtualId = null;
                    document.getElementById('galeriaItensCard').style.display = 'none';
                }
                
                loadGalerias();
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir galeria');
            }
        } catch (error) {
            console.error('Erro ao excluir galeria:', error);
            showError('Erro ao excluir galeria');
        }
    }
}

// ========== GERENCIAR ITENS DA GALERIA (Fotos) ==========

async function saveGaleriaItem(formData) {
    try {
        if (!galeriaAtualId) {
            showError('Selecione uma galeria primeiro!');
            return;
        }
        
        const form = document.getElementById('novaImagemForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        // Garantir que o galeria_id está no formData
        formData.set('galeria_id', galeriaAtualId);
        
        const url = isEdit ? `${API_BASE}/galeria-itens/${editId}` : `${API_BASE}/galerias/${galeriaAtualId}/itens`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Foto atualizada com sucesso!' : 'Foto adicionada à galeria com sucesso!');
            closeModal('novaImagemModal');
            
            // Reset form
            form.reset();
            form.removeAttribute('data-edit-id');
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Adicionar à Galeria';
            document.querySelector('#novaImagemModal .modal-header h3').innerHTML = '<i class="fas fa-image"></i> Nova Foto';
            form.querySelector('[name="imagem"]').setAttribute('required', 'required');
            
            loadGaleriaItens(galeriaAtualId);
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar foto' : 'Erro ao adicionar foto'));
        }
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        showError('Erro ao salvar foto');
    }
}

async function editGaleriaItem(id) {
    // Preciso buscar o item do servidor pois não está mais na variável global
    try {
        const response = await fetch(`${API_BASE}/galeria-itens/${id}`);
        const item = await response.json();
        
        if (item) {
            const form = document.getElementById('novaImagemForm');
            form.querySelector('[name="titulo"]').value = item.titulo || '';
            form.querySelector('[name="descricao"]').value = item.descricao || '';
            form.querySelector('[name="ordem"]').value = item.ordem || 0;
            
            // Modo de edição
            form.setAttribute('data-edit-id', id);
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Foto';
            
            openModal('novaImagemModal');
            document.querySelector('#novaImagemModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Foto';
            
            // Tornar o campo de imagem opcional para edição
            form.querySelector('[name="imagem"]').removeAttribute('required');
        }
    } catch (error) {
        console.error('Erro ao carregar item para edição:', error);
        showError('Erro ao carregar foto');
    }
}

async function deleteGaleriaItem(id) {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
        try {
            const response = await fetch(`${API_BASE}/galeria-itens/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Foto excluída com sucesso!');
                loadGaleriaItens(galeriaAtualId);
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir foto');
            }
        } catch (error) {
            console.error('Erro ao excluir foto:', error);
            showError('Erro ao excluir foto');
        }
    }
}

// ===================== CARROSSEL =====================

async function loadCarrossel() {
    try {
        const response = await fetch(`${API_BASE}/carrossel`);
        carrossel = await response.json();
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

// ===================== REGULAMENTOS =====================

async function loadRegulamentos() {
    try {
        const response = await fetch(`${API_BASE}/regulamentos`);
        regulamentos = await response.json();
        renderRegulamentos();
    } catch (error) {
        console.error('Erro ao carregar regulamentos:', error);
        showError('Erro ao carregar regulamentos');
    }
}

function renderRegulamentos() {
    const container = document.getElementById('regulamentosList');
    
    if (regulamentos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-gavel" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Nenhum regulamento cadastrado ainda.</p>
                <button class="btn btn-primary" onclick="openModal('regulamentoModal')" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Criar Primeiro Regulamento
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = regulamentos.map(reg => `
        <div class="item-card ${reg.ativo ? 'ativo' : 'inativo'}">
            <div class="item-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 class="item-title">${reg.titulo}</h3>
                    ${reg.subtitulo ? `<p style="color: #666; margin: 0.5rem 0;">${reg.subtitulo}</p>` : ''}
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="badge ${reg.ativo ? 'badge-success' : 'badge-secondary'}">
                        ${reg.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                    <span class="badge badge-primary">Ano: ${reg.ano}</span>
                </div>
            </div>
            <div class="item-meta">
                <strong>Publicado em:</strong> ${new Date(reg.created_at).toLocaleDateString('pt-BR')} às ${new Date(reg.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}<br>
                ${reg.updated_at && reg.updated_at !== reg.created_at ? `<strong>Última atualização:</strong> ${new Date(reg.updated_at).toLocaleDateString('pt-BR')} às ${new Date(reg.updated_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}<br>` : ''}
                <strong>Conteúdo:</strong><br>
                <div style="max-height: 100px; overflow: hidden; text-overflow: ellipsis; color: #666; margin: 0.5rem 0;">
                    ${reg.conteudo.substring(0, 200)}...
                </div>
                ${reg.arquivo_pdf ? `<div style="margin-top: 0.5rem;"><i class="fas fa-file-pdf"></i> PDF disponível para download</div>` : ''}
            </div>
            <div class="item-actions" style="margin-top: 1rem;">
                ${reg.arquivo_pdf ? `
                    <a href="${reg.arquivo_pdf}" target="_blank" class="btn btn-primary btn-sm">
                        <i class="fas fa-download"></i> Download PDF
                    </a>
                ` : ''}
                <button class="btn btn-secondary btn-sm" onclick="editRegulamento(${reg.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRegulamento(${reg.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

async function saveRegulamento(formData) {
    const form = document.getElementById('regulamentoForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        // Validar tamanho do arquivo PDF (máximo 10MB)
        const arquivoPdf = formData.get('arquivo_pdf');
        if (arquivoPdf && arquivoPdf.size > 0) {
            const maxSize = 10 * 1024 * 1024; // 10MB em bytes
            if (arquivoPdf.size > maxSize) {
                showError('O arquivo PDF é muito grande! Tamanho máximo: 10MB. Tamanho do arquivo: ' + (arquivoPdf.size / 1024 / 1024).toFixed(2) + 'MB');
                return;
            }
        }
        
        // Validar tamanho do conteúdo (máximo 50.000 caracteres)
        const conteudo = formData.get('conteudo');
        if (conteudo && conteudo.length > 50000) {
            showError('O conteúdo é muito grande! Máximo: 50.000 caracteres. Seu conteúdo tem: ' + conteudo.length + ' caracteres.');
            return;
        }
        
        const editId = form.getAttribute('data-edit-id');
        const isEdit = editId !== null;
        
        // Mostrar loading no botão
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        
        // Mostrar mensagem de progresso
        showInfo('Enviando dados... Por favor, aguarde.');
        
        const url = isEdit ? `${API_BASE}/regulamento/${editId}` : `${API_BASE}/regulamento`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(isEdit ? 'Regulamento atualizado com sucesso!' : 'Regulamento criado com sucesso!');
            closeModal('regulamentoModal');
            
            // Reset form
            form.reset();
            form.removeAttribute('data-edit-id');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Regulamento';
            document.querySelector('#regulamentoModal .modal-header h3').innerHTML = '<i class="fas fa-gavel"></i> Novo Regulamento';
            form.querySelector('[name="arquivo_pdf"]').removeAttribute('required');
            
            loadRegulamentos();
            loadStats();
        } else {
            showError(result.error || (isEdit ? 'Erro ao atualizar regulamento' : 'Erro ao criar regulamento'));
        }
    } catch (error) {
        console.error('Erro ao salvar regulamento:', error);
        showError('Erro ao salvar regulamento. Verifique o console para mais detalhes.');
    } finally {
        // Restaurar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

async function editRegulamento(id) {
    const regulamento = regulamentos.find(r => r.id === id);
    if (regulamento) {
        const form = document.getElementById('regulamentoForm');
        form.querySelector('[name="titulo"]').value = regulamento.titulo || '';
        form.querySelector('[name="subtitulo"]').value = regulamento.subtitulo || '';
        form.querySelector('[name="ano"]').value = regulamento.ano || new Date().getFullYear();
        form.querySelector('[name="conteudo"]').value = regulamento.conteudo || '';
        form.querySelector('[name="ativo"]').checked = regulamento.ativo === 1;
        
        // Modo de edição
        form.setAttribute('data-edit-id', id);
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Atualizar Regulamento';
        
        openModal('regulamentoModal');
        document.querySelector('#regulamentoModal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Editar Regulamento';
    }
}

async function deleteRegulamento(id) {
    const regulamento = regulamentos.find(r => r.id === id);
    if (regulamento && confirm(`Tem certeza que deseja excluir o regulamento "${regulamento.titulo}"?\n\nEsta ação não pode ser desfeita.`)) {
        try {
            const response = await fetch(`${API_BASE}/regulamento/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess('Regulamento excluído com sucesso!');
                loadRegulamentos();
                loadStats();
            } else {
                showError(result.error || 'Erro ao excluir regulamento');
            }
        } catch (error) {
            console.error('Erro ao excluir regulamento:', error);
            showError('Erro ao excluir regulamento');
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
        const configuracoes = await response.json();
        
        // Converter array em objeto para facilitar acesso
        const configMap = {};
        if (Array.isArray(configuracoes)) {
            configuracoes.forEach(config => {
                configMap[config.chave] = config.valor;
            });
        }
        
        // Preencher campos com valores do banco
        const setValueIfExists = (id, value) => {
            const element = document.getElementById(id);
            if (element && value) element.value = value;
        };
        
        setValueIfExists('siteName', configMap.site_name);
        setValueIfExists('siteSlogan', configMap.site_slogan);
        setValueIfExists('siteEmail', configMap.site_email);
        setValueIfExists('sitePhone', configMap.site_phone);
        setValueIfExists('siteAddress', configMap.site_address);
        setValueIfExists('siteWhatsapp', configMap.site_whatsapp);
        setValueIfExists('siteInstagram', configMap.site_instagram);
        setValueIfExists('siteFacebook', configMap.site_facebook);
        setValueIfExists('siteYoutube', configMap.site_youtube);
        setValueIfExists('siteUrl', configMap.site_url);
        setValueIfExists('feiraInicio', configMap.feira_inicio);
        setValueIfExists('feiraFim', configMap.feira_fim);
        setValueIfExists('orgName', configMap.org_name);
        setValueIfExists('orgDescription', configMap.org_description);
        setValueIfExists('feiraDescription', configMap.feira_description);
        
        // Preview das logos se existirem
        if (configMap.navbar_logo) {
            const navbarPreview = document.getElementById('navbarLogoPreview');
            if (navbarPreview) {
                navbarPreview.innerHTML = `<img src="${API_BASE.replace('/api', '')}${configMap.navbar_logo}" style="max-width: 200px; border: 1px solid #ddd; padding: 10px; border-radius: 8px; margin-top: 10px;">`;
            }
        }
        
        if (configMap.footer_logo) {
            const footerPreview = document.getElementById('footerLogoPreview');
            if (footerPreview) {
                footerPreview.innerHTML = `<img src="${API_BASE.replace('/api', '')}${configMap.footer_logo}" style="max-width: 120px; border: 1px solid #ddd; padding: 10px; border-radius: 8px; margin-top: 10px;">`;
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

async function saveConfiguracoes() {
    try {
        // 1. Upload das logos primeiro (se houver)
        const navbarLogoInput = document.getElementById('navbarLogo');
        const footerLogoInput = document.getElementById('footerLogo');
        
        if (navbarLogoInput.files.length > 0 || footerLogoInput.files.length > 0) {
            const formData = new FormData();
            if (navbarLogoInput.files.length > 0) {
                formData.append('navbarLogo', navbarLogoInput.files[0]);
            }
            if (footerLogoInput.files.length > 0) {
                formData.append('footerLogo', footerLogoInput.files[0]);
            }
            
            const logoResponse = await fetch(`${API_BASE}/configuracoes/upload-logos`, {
                method: 'POST',
                body: formData
            });
            
            const logoResult = await logoResponse.json();
            if (!logoResult.success) {
                showError('Erro ao fazer upload das logos');
                return;
            }
        }
        
        // 2. Salvar demais configurações
        const getValueOrEmpty = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };
        
        const configuracoes = {
            site_name: { valor: getValueOrEmpty('siteName'), descricao: 'Nome do site' },
            site_email: { valor: getValueOrEmpty('siteEmail'), descricao: 'Email principal' },
            site_phone: { valor: getValueOrEmpty('sitePhone'), descricao: 'Telefone de contato' },
            site_address: { valor: getValueOrEmpty('siteAddress'), descricao: 'Endereço da feira' },
            site_whatsapp: { valor: getValueOrEmpty('siteWhatsapp'), descricao: 'WhatsApp' },
            site_instagram: { valor: getValueOrEmpty('siteInstagram'), descricao: 'Instagram' },
            site_facebook: { valor: getValueOrEmpty('siteFacebook'), descricao: 'Facebook' },
            site_youtube: { valor: getValueOrEmpty('siteYoutube'), descricao: 'YouTube' },
            site_url: { valor: getValueOrEmpty('siteUrl'), descricao: 'Site oficial' },
            feira_inicio: { valor: getValueOrEmpty('feiraInicio'), descricao: 'Data de início' },
            feira_fim: { valor: getValueOrEmpty('feiraFim'), descricao: 'Data de fim' },
            site_slogan: { valor: getValueOrEmpty('siteSlogan'), descricao: 'Slogan/Subtítulo' },
            org_name: { valor: getValueOrEmpty('orgName'), descricao: 'Nome da organização' },
            org_description: { valor: getValueOrEmpty('orgDescription'), descricao: 'Descrição da organização' },
            feira_description: { valor: getValueOrEmpty('feiraDescription'), descricao: 'Descrição da feira no footer' }
        };
        
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
            // Limpar os inputs de file
            if (navbarLogoInput) navbarLogoInput.value = '';
            if (footerLogoInput) footerLogoInput.value = '';
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
    
    // Preview da galeria de imagens do expositor
    const galeriaInput = document.getElementById('galeria_fotos');
    if (galeriaInput) {
        galeriaInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const preview = document.getElementById('galeria_preview');
            const previewGrid = document.getElementById('galeria_preview_images');
            
            if (files.length === 0) {
                preview.style.display = 'none';
                return;
            }
            
            // Limitar a 5 imagens
            if (files.length > 5) {
                alert('Máximo de 5 imagens permitidas. Selecionando apenas as 5 primeiras.');
                const dataTransfer = new DataTransfer();
                files.slice(0, 5).forEach(file => dataTransfer.items.add(file));
                e.target.files = dataTransfer.files;
            }
            
            // Limpar preview anterior
            previewGrid.innerHTML = '';
            preview.style.display = 'block';
            
            // Criar previews
            files.slice(0, 5).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const div = document.createElement('div');
                    div.className = 'galeria-preview-item';
                    div.innerHTML = `
                        <img src="${event.target.result}" alt="Preview ${index + 1}">
                        <button type="button" class="galeria-preview-remove" onclick="removeGaleriaPreview(${index})" title="Remover">×</button>
                    `;
                    previewGrid.appendChild(div);
                };
                reader.readAsDataURL(file);
            });
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
    
    // Form de Nova Galeria (Coleção)
    const novaGaleriaForm = document.getElementById('novaGaleriaForm');
    if (novaGaleriaForm) {
        novaGaleriaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveGaleria(formData);
        });
    }
    
    // Form de Nova Imagem (Foto da Galeria)
    const novaImagemForm = document.getElementById('novaImagemForm');
    if (novaImagemForm) {
        novaImagemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveGaleriaItem(formData);
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
    const regulamentoForm = document.getElementById('regulamentoForm');
    if (regulamentoForm) {
        regulamentoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            saveRegulamento(formData);
        });
    }
    
    // Contador de caracteres do conteúdo
    const conteudoTextarea = document.getElementById('regulamentoConteudo');
    const conteudoCounter = document.getElementById('conteudoCounter');
    if (conteudoTextarea && conteudoCounter) {
        conteudoTextarea.addEventListener('input', function() {
            const length = this.value.length;
            conteudoCounter.textContent = `${length.toLocaleString('pt-BR')} / 50.000 caracteres`;
            if (length > 50000) {
                conteudoCounter.style.color = 'red';
            } else if (length > 45000) {
                conteudoCounter.style.color = 'orange';
            } else {
                conteudoCounter.style.color = '#666';
            }
        });
    }
    
    // Indicador de tamanho do arquivo PDF
    const pdfInput = document.getElementById('regulamentoPdf');
    const pdfSizeInfo = document.getElementById('pdfSizeInfo');
    if (pdfInput && pdfSizeInfo) {
        pdfInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const sizeMB = (this.files[0].size / 1024 / 1024).toFixed(2);
                pdfSizeInfo.textContent = `Arquivo: ${sizeMB} MB`;
                if (this.files[0].size > 10485760) {
                    pdfSizeInfo.style.color = 'red';
                } else {
                    pdfSizeInfo.style.color = '#4CAF50';
                }
            } else {
                pdfSizeInfo.textContent = '';
            }
        });
    }
    
    // Preview dos logos (navbar e footer)
    const navbarLogoInput = document.getElementById('navbarLogo');
    const footerLogoInput = document.getElementById('footerLogo');
    
    if (navbarLogoInput) {
        navbarLogoInput.addEventListener('change', function() {
            const preview = document.getElementById('navbarLogoPreview');
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview Logo Navbar" style="max-width: 200px; max-height: 80px; border: 2px solid #4CAF50; border-radius: 8px; padding: 10px; background: white;">`;
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                preview.innerHTML = '';
            }
        });
    }
    
    if (footerLogoInput) {
        footerLogoInput.addEventListener('change', function() {
            const preview = document.getElementById('footerLogoPreview');
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview Logo Footer" style="max-width: 120px; max-height: 120px; border: 2px solid #4CAF50; border-radius: 8px; padding: 10px; background: white;">`;
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                preview.innerHTML = '';
            }
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

// ===================== HELPER FUNCTIONS =====================

function removeGaleriaPreview(index) {
    const galeriaInput = document.getElementById('galeria_fotos');
    if (!galeriaInput || !galeriaInput.files) return;
    
    const filesArray = Array.from(galeriaInput.files);
    filesArray.splice(index, 1);
    
    const dataTransfer = new DataTransfer();
    filesArray.forEach(file => dataTransfer.items.add(file));
    galeriaInput.files = dataTransfer.files;
    
    // Trigger change event to update preview
    galeriaInput.dispatchEvent(new Event('change'));
}

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
window.saveConfiguracoes = saveConfiguracoes;
window.previewImage = previewImage;
window.removeGaleriaPreview = removeGaleriaPreview;
window.logout = logout;

// ===================== GERENCIAMENTO DE MENSAGENS =====================

let mensagensAtual = [];
let paginaMensagenAtual = 1;

async function loadMensagens(page = 1) {
    try {
        paginaMensagenAtual = page;
        const filtro = document.getElementById('filtro-mensagens')?.value || 'todas';
        
        const response = await fetch(`${API_BASE}/mensagens?page=${page}&limit=10`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erro ao carregar mensagens');
        
        const data = await response.json();
        mensagensAtual = data.mensagens;
        
        // Aplicar filtro local se necessário
        let mensagensFiltradas = mensagensAtual;
        if (filtro === 'lidas') {
            mensagensFiltradas = mensagensAtual.filter(m => m.lida === 1);
        } else if (filtro === 'nao-lidas') {
            mensagensFiltradas = mensagensAtual.filter(m => m.lida === 0);
        }
        
        displayMensagens(mensagensFiltradas);
        displayPaginacaoMensagens(data.pagination);
        
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        document.getElementById('mensagens-list').innerHTML = 
            '<div style="text-align: center; color: #ff4444; padding: 40px;"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar mensagens</div>';
    }
}

function displayMensagens(mensagens) {
    const container = document.getElementById('mensagens-list');
    
    if (!mensagens || mensagens.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;"><i class="fas fa-inbox"></i> Nenhuma mensagem encontrada</div>';
        return;
    }
    
    container.innerHTML = mensagens.map(msg => `
        <div class="mensagem-item ${msg.lida ? '' : 'nao-lida'}" onclick="visualizarMensagem(${msg.id})">
            <div class="mensagem-header">
                <strong>${msg.nome}</strong>
                <span class="mensagem-email">${msg.email}</span>
                ${!msg.lida ? '<span class="badge-new">NOVA</span>' : ''}
                <span class="mensagem-data">${formatarDataBr(msg.created_at)}</span>
            </div>
            <div class="mensagem-telefone"><i class="fas fa-phone"></i> ${msg.telefone}</div>
            <div class="mensagem-preview">${msg.mensagem_resumo || 'Sem mensagem'}</div>
        </div>
    `).join('');
}

function displayPaginacaoMensagens(pagination) {
    const container = document.getElementById('mensagens-pagination');
    if (!pagination || pagination.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="pagination">';
    
    if (pagination.page > 1) {
        html += `<button onclick="loadMensagens(${pagination.page - 1})" class="btn btn-sm">‹ Anterior</button>`;
    }
    
    for (let i = 1; i <= pagination.totalPages; i++) {
        if (i === pagination.page) {
            html += `<button class="btn btn-sm btn-primary">${i}</button>`;
        } else {
            html += `<button onclick="loadMensagens(${i})" class="btn btn-sm">${i}</button>`;
        }
    }
    
    if (pagination.page < pagination.totalPages) {
        html += `<button onclick="loadMensagens(${pagination.page + 1})" class="btn btn-sm">Próxima ›</button>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

async function visualizarMensagem(id) {
    try {
        const response = await fetch(`${API_BASE}/mensagens/${id}`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erro ao carregar mensagem');
        
        const mensagem = await response.json();
        
        document.getElementById('mensagem-modal-content').innerHTML = `
            <div class="mensagem-completa">
                <div class="mensagem-header-modal">
                    <h3><i class="fas fa-user"></i> ${mensagem.nome}</h3>
                    <div class="mensagem-meta">
                        <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${mensagem.email}</p>
                        <p><i class="fas fa-phone"></i> <strong>Telefone:</strong> ${mensagem.telefone}</p>
                        <p><i class="fas fa-clock"></i> <strong>Enviada em:</strong> ${formatarDataBr(mensagem.created_at)}</p>
                        ${mensagem.ip_address ? `<p><i class="fas fa-globe"></i> <strong>IP:</strong> ${mensagem.ip_address}</p>` : ''}
                    </div>
                </div>
                
                ${mensagem.mensagem ? `
                    <div class="mensagem-conteudo">
                        <h4><i class="fas fa-comment"></i> Mensagem:</h4>
                        <div class="mensagem-texto">${mensagem.mensagem.replace(/\n/g, '<br>')}</div>
                    </div>
                ` : ''}
                
                <div class="mensagem-acoes">
                    <button onclick="marcarComoLida(${mensagem.id}, ${!mensagem.lida})" class="btn ${mensagem.lida ? 'btn-secondary' : 'btn-primary'}">
                        <i class="fas fa-${mensagem.lida ? 'eye-slash' : 'eye'}"></i> 
                        Marcar como ${mensagem.lida ? 'não lida' : 'lida'}
                    </button>
                    <button onclick="deletarMensagem(${mensagem.id})" class="btn btn-danger">
                        <i class="fas fa-trash"></i> Deletar
                    </button>
                    <a href="mailto:${mensagem.email}" class="btn btn-success">
                        <i class="fas fa-reply"></i> Responder por Email
                    </a>
                </div>
            </div>
        `;
        
        document.getElementById('mensagem-modal').style.display = 'block';
        
        // Recarregar lista para atualizar status de lida
        loadMensagens(paginaMensagenAtual);
        loadMensagensStats();
        
    } catch (error) {
        console.error('Erro ao visualizar mensagem:', error);
        alert('Erro ao carregar mensagem');
    }
}

async function marcarComoLida(id, lida) {
    try {
        const response = await fetch(`${API_BASE}/mensagens/${id}/lida`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ lida })
        });
        
        if (!response.ok) throw new Error('Erro ao atualizar mensagem');
        
        document.getElementById('mensagem-modal').style.display = 'none';
        loadMensagens(paginaMensagenAtual);
        loadMensagensStats();
        
    } catch (error) {
        console.error('Erro ao marcar mensagem:', error);
        alert('Erro ao atualizar mensagem');
    }
}

async function deletarMensagem(id) {
    if (!confirm('Deseja realmente deletar esta mensagem? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/mensagens/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erro ao deletar mensagem');
        
        document.getElementById('mensagem-modal').style.display = 'none';
        loadMensagens(paginaMensagenAtual);
        loadMensagensStats();
        
    } catch (error) {
        console.error('Erro ao deletar mensagem:', error);
        alert('Erro ao deletar mensagem');
    }
}

async function loadMensagensStats() {
    try {
        const response = await fetch(`${API_BASE}/mensagens/stats/count`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Erro ao carregar estatísticas');
        
        const stats = await response.json();
        
        document.getElementById('total-mensagens').textContent = stats.total;
        document.getElementById('mensagens-nao-lidas').textContent = stats.nao_lidas;
        document.getElementById('mensagens-lidas').textContent = stats.lidas;
        
        // Atualizar badge na aba
        const badge = document.getElementById('mensagens-badge');
        if (badge) {
            badge.textContent = stats.nao_lidas;
            badge.className = stats.nao_lidas > 0 ? 'badge' : 'badge zero';
        }
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas de mensagens:', error);
    }
}

function fecharModalMensagem() {
    document.getElementById('mensagem-modal').style.display = 'none';
}

function formatarDataBr(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Expor funções globalmente
window.loadMensagens = loadMensagens;
window.visualizarMensagem = visualizarMensagem;
window.marcarComoLida = marcarComoLida;
window.deletarMensagem = deletarMensagem;
window.fecharModalMensagem = fecharModalMensagem;