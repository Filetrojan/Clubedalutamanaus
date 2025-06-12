document.addEventListener('DOMContentLoaded', () => {

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const formInscricao = document.getElementById('formInscricao');
    const formAposta = document.getElementById('formAposta');
    const listaRanking = document.getElementById('lista-ranking');
    const apostaLutadorSelect = document.getElementById('apostaLutador');
    const musica = document.getElementById('musica-fundo');
    const btnMusica = document.getElementById('btn-musica');
    const modalEdicao = document.getElementById('edit-modal');
    const modalSucesso = document.getElementById('success-modal');
    const pendingBetsList = document.getElementById('pending-bets-list');
    const btnLogout = document.getElementById('btn-logout');

    if (formInscricao) {
        formInscricao.addEventListener('submit', (event) => {
            event.preventDefault();
            const novoLutador = { nome: document.getElementById('nome').value.trim(), peso: document.getElementById('peso').value, instagram: document.getElementById('instagram').value.trim(), estilo: document.getElementById('estilo').value, whatsapp: document.getElementById('whatsapp').value.trim() };
            if (!novoLutador.nome || !novoLutador.whatsapp) {
                alert('Por favor, preencha pelo menos o Nome e o WhatsApp.');
                return;
            }
            const lutadoresAtuais = JSON.parse(localStorage.getItem('lutadores')) || [];
            lutadoresAtuais.push(novoLutador);
            localStorage.setItem('lutadores', JSON.stringify(lutadoresAtuais));
            carregarLutadoresSalvos();
            formInscricao.reset();
            mostrarModalSucesso(); 
        });
    }

    if (formAposta) {
        formAposta.addEventListener('submit', function (event) {
            event.preventDefault();
            const apostadorNome = document.getElementById('apostadorNome').value.trim();
            const lutadorSelecionado = document.getElementById('apostaLutador').value;
            const valorAposta = parseFloat(document.getElementById('valorAposta').value);
            if (!apostadorNome || !lutadorSelecionado || !valorAposta || valorAposta <= 0) {
                alert('Por favor, preencha todos os campos da aposta corretamente.');
                return;
            }
            const novaAposta = { apostador: apostadorNome, lutador: lutadorSelecionado, valor: valorAposta, status: 'pendente' };
            let apostas = JSON.parse(localStorage.getItem('apostas')) || [];
            apostas.push(novaAposta);
            localStorage.setItem('apostas', JSON.stringify(apostas));
            const numeroAdminWhatsApp = '5592SEUNUMEROAQUI';
            const valorFormatado = valorAposta.toFixed(2).replace('.', ',');
            const mensagem = `Olá! Meu nome é ${apostadorNome} e quero confirmar minha aposta de R$${valorFormatado} no lutador(a) *${lutadorSelecionado}*.`;
            const mensagemCodificada = encodeURIComponent(mensagem);
            const urlWhatsApp = `https://wa.me/${numeroAdminWhatsApp}?text=${mensagemCodificada}`;
            formAposta.reset();
            alert('Aposta registrada! Você será redirecionado para o WhatsApp para confirmar.');
            window.open(urlWhatsApp, '_blank');
        });
    }

    function getEmojiPorEstilo(estilo) {
        switch (estilo) { case 'Muay Thai': return '🔥'; case 'Boxe': return '🥊'; case 'Jiu-Jitsu': return '🥋'; default: return '💥'; }
    }

    function carregarLutadoresSalvos() {
        if (!listaRanking) return;
        const lutadores = JSON.parse(localStorage.getItem('lutadores')) || [];
        listaRanking.innerHTML = '';
        if (apostaLutadorSelect) {
            while (apostaLutadorSelect.options.length > 1) { apostaLutadorSelect.remove(1); }
        }
        lutadores.forEach((lutador, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';
            let adminActionsHTML = '';
            if (isAdmin) {
                adminActionsHTML = `<div class="ranking-item-acoes" data-label="Ações:"><button class="btn-admin-action" data-action="edit" data-index="${index}" title="Editar">✏️</button><button class="btn-admin-action" data-action="delete" data-index="${index}" title="Excluir">🗑️</button></div>`;
            }
            let instagramHTML = '';
            if (lutador.instagram && lutador.instagram.trim() !== '') {
                const username = lutador.instagram.replace('@', '').trim();
                instagramHTML = `<a href="https://www.instagram.com/${username}/" target="_blank" rel="noopener noreferrer" class="stat-link"><div class="stat-item"><span class="stat-icon"><svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.111 0-3.483.011-4.708.066-2.828.129-4.004 1.315-4.138 4.138-.055 1.225-.066 1.597-.066 4.708s.011 3.483.066 4.708c.134 2.822 1.31 4.004 4.138 4.138 1.225.055 1.597.066 4.708.066s3.483-.011 4.708-.066c2.828-.129 4.004-1.315 4.138-4.138.055-1.225.066-1.597.066-4.708s-.011-3.483-.066-4.708c-.134-2.822-1.31-4.004-4.138-4.138-1.225-.055-1.597-.066-4.708-.066zm0 2.882c-1.955 0-3.521 1.566-3.521 3.521s1.566 3.521 3.521 3.521 3.521-1.566 3.521-3.521-1.566-3.521-3.521-3.521zm0 5.602c-1.151 0-2.08-.929-2.08-2.08s.929-2.08 2.08-2.08 2.08.929 2.08 2.08-.929 2.08-2.08 2.08zm4.958-6.402c-.722 0-1.306.584-1.306 1.306s.584 1.306 1.306 1.306 1.306-.584 1.306-1.306-.584-1.306-1.306-1.306z"></path></svg></span><span>${lutador.instagram}</span></div></a>`;
            } else {
                instagramHTML = `<div class="stat-item"><span class="stat-icon">📷</span><span>N/A</span></div>`;
            }
            item.innerHTML = `<div class="ranking-card-header"><div class="ranking-card-pos">#${index + 1}</div><div class="ranking-card-nome">${lutador.nome}</div></div><div class="ranking-card-body">${instagramHTML}<div class="stat-item"><span class="stat-icon">⚖️</span><span>${lutador.peso} kg</span></div><div class="stat-item"><span class="stat-icon">${getEmojiPorEstilo(lutador.estilo)}</span><span>${lutador.estilo}</span></div></div>${adminActionsHTML}`;
            listaRanking.appendChild(item);
            const novaOpcao = document.createElement('option');
            novaOpcao.value = lutador.nome;
            novaOpcao.textContent = lutador.nome;
            if(apostaLutadorSelect) apostaLutadorSelect.appendChild(novaOpcao);
        });
        if (isAdmin) ativarModoAdmin();
    }

    function carregarRankingApostas() {
        const container = document.getElementById('ranking-apostas');
        if (!container) return;
        const apostas = JSON.parse(localStorage.getItem('apostas')) || [];
        const apostasAprovadas = apostas.filter(aposta => aposta.status === 'aprovada');
        apostasAprovadas.sort((a, b) => b.valor - a.valor);
        container.innerHTML = ''; 
        if (apostasAprovadas.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #777;">Ainda não há apostas em destaque.</p>';
            return;
        }
        apostasAprovadas.forEach(aposta => {
            const card = document.createElement('div');
            card.className = 'aposta-card';
            card.innerHTML = `<h3 class="apostador-nome">👑 ${aposta.apostador}</h3><p class="aposta-detalhes">apostou em <strong>${aposta.lutador}</strong></p><p class="aposta-valor">R$ ${aposta.valor.toFixed(2).replace('.', ',')}</p>`;
            container.appendChild(card);
        });
    }
    
    function carregarApostasPendentesAdmin() {
        if (!isAdmin) return;
        const container = document.getElementById('pending-bets-list');
        if (!container) return;
        const apostas = JSON.parse(localStorage.getItem('apostas')) || [];
        container.innerHTML = '';
        const apostasPendentes = apostas.filter(a => a.status === 'pendente');
        if (apostasPendentes.length === 0) {
            container.innerHTML = '<p>Nenhuma nova aposta para analisar.</p>';
            return;
        }
        apostas.forEach((aposta, index) => {
            if (aposta.status === 'pendente') {
                const item = document.createElement('div');
                item.className = 'pending-bet-item';
                item.innerHTML = `<div class="pending-bet-details"><strong>Apostador:</strong> ${aposta.apostador}</div><div class="pending-bet-details"><strong>No Lutador:</strong> ${aposta.lutador}</div><div class="pending-bet-details"><strong>Valor:</strong> R$ ${aposta.valor.toFixed(2).replace('.',',')}</div><div class="pending-bet-actions"><button class="btn-approve" data-action="approve" data-index="${index}">Aprovar</button><button class="btn-reject" data-action="reject-bet" data-index="${index}">Recusar</button></div>`;
                container.appendChild(item);
            }
        });
    }

    function ativarModoAdmin() {
        document.querySelectorAll('.admin-only').forEach(el => { el.style.display = 'block'; });
        document.querySelectorAll('.ranking-header').forEach(el => { el.style.gridTemplateColumns = '30px 1fr 1fr 60px 40px 80px'; });
        carregarApostasPendentesAdmin();
    }

    function excluirLutador(index) {
        let lutadores = JSON.parse(localStorage.getItem('lutadores')) || [];
        lutadores.splice(index, 1);
        localStorage.setItem('lutadores', JSON.stringify(lutadores));
        carregarLutadoresSalvos();
    }

    function abrirModalEdicao(index) {
        const lutadores = JSON.parse(localStorage.getItem('lutadores')) || [];
        const lutador = lutadores[index];
        if (!lutador || !modalEdicao) return;
        document.getElementById('edit-index').value = index;
        document.getElementById('edit-nome').value = lutador.nome;
        document.getElementById('edit-peso').value = lutador.peso;
        document.getElementById('edit-instagram').value = lutador.instagram;
        document.getElementById('edit-estilo').value = lutador.estilo;
        document.getElementById('edit-whatsapp').value = lutador.whatsapp;
        modalEdicao.classList.remove('hidden');
    }

    function fecharModalEdicao() { if(modalEdicao) modalEdicao.classList.add('hidden'); }

    function salvarEdicao(event) {
        event.preventDefault();
        const index = document.getElementById('edit-index').value;
        let lutadores = JSON.parse(localStorage.getItem('lutadores')) || [];
        lutadores[index] = { nome: document.getElementById('edit-nome').value, peso: document.getElementById('edit-peso').value, instagram: document.getElementById('edit-instagram').value, estilo: document.getElementById('edit-estilo').value, whatsapp: document.getElementById('edit-whatsapp').value };
        localStorage.setItem('lutadores', JSON.stringify(lutadores));
        fecharModalEdicao();
        carregarLutadoresSalvos();
    }

    function aprovarAposta(index) {
        let apostas = JSON.parse(localStorage.getItem('apostas')) || [];
        if (apostas[index]) {
            apostas[index].status = 'aprovada';
            localStorage.setItem('apostas', JSON.stringify(apostas));
            carregarApostasPendentesAdmin();
            carregarRankingApostas();
        }
    }

    function recusarAposta(index) {
        let apostas = JSON.parse(localStorage.getItem('apostas')) || [];
        apostas.splice(index, 1);
        localStorage.setItem('apostas', JSON.stringify(apostas));
        carregarApostasPendentesAdmin();
    }
    
    function mostrarModalSucesso() { if(modalSucesso) modalSucesso.classList.remove('hidden'); }
    function fecharModalSucesso() { if(modalSucesso) modalSucesso.classList.add('hidden'); }

    if (listaRanking) {
        listaRanking.addEventListener('click', function(event) {
            const button = event.target.closest('.btn-admin-action');
            if (!isAdmin || !button) return;
            const action = button.dataset.action;
            const index = parseInt(button.dataset.index);
            if (action === 'edit') abrirModalEdicao(index);
            else if (action === 'delete') {
                if (confirm('Tem certeza?')) excluirLutador(index);
            }
        });
    }
    if (pendingBetsList && isAdmin) {
        pendingBetsList.addEventListener('click', function(event) {
            const target = event.target;
            const action = target.dataset.action;
            const index = parseInt(target.dataset.index);
            if (action === 'approve') aprovarAposta(index);
            else if (action === 'reject-bet') {
                if(confirm('Tem certeza?')) recusarAposta(index);
            }
        });
    }
    if (modalEdicao) {
        document.getElementById('edit-form').addEventListener('submit', salvarEdicao);
        document.getElementById('btn-cancel-edit').addEventListener('click', fecharModalEdicao);
    }
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('isAdmin');
            window.location.reload();
        });
    }
    const btnFecharSucesso = document.getElementById('btn-close-success');
    if(btnFecharSucesso) btnFecharSucesso.addEventListener('click', fecharModalSucesso);
    if(modalSucesso) {
        modalSucesso.addEventListener('click', function(event) { if (event.target === modalSucesso) fecharModalSucesso(); });
    }
    if (btnMusica && musica) {
        musica.volume = 0.2;
        document.body.addEventListener('click', function() { if (musica.paused) { musica.play().catch(e => {}); } }, { once: true });
        btnMusica.addEventListener('click', (e) => {
            e.stopPropagation();
            if (musica.paused) { musica.play(); btnMusica.textContent = '❚❚ Som'; }
            else { musica.pause(); btnMusica.textContent = '▶️ Som'; }
        });
    }

    carregarLutadoresSalvos();
    carregarRankingApostas();
    if (isAdmin) {
        ativarModoAdmin();
    }
});